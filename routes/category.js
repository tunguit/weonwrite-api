const uuid = require("uuid");
const CategoryModel = require("./../models/categoryModel");
const formatResponse = require("../configs/formatReponse");
const { uploadFile } = require("../configs/upload");
const paging  = require("../configs/pagination");
const system_notify  = require("../configs/messages_en");
const _ = require('lodash');
const Promise = require("bluebird");

const IMAGE_DIR = "./uploads/categories";
const NAME = "uploads";

const upload = uploadFile(IMAGE_DIR, NAME);

const mainCategories = {
  DIABETES: "diabetes",
  TREATMENT: "treament",
  NUTRITION: "nutrition",
  EXERCISE: "exercise",
  MEDICINE: "medicine",
  BLOOD_GLUCOSE_MEASUREMENT: "blood_glucose_measurement",
  MENTALITY: "mentality"
}

module.exports = router => {

  router.get('/', (req, res, next) => {

    let options = paging.getPagingParams(req)

    options.sort = {
      order: 'asc',
      createdAt: 'desc'
    }

    CategoryModel.paginate({
      parent_id: null
    }, options, (err, categories) => {
      if (err) {
        err.code = 500;
        return next(err);
      }

      let docs = []

      const promises = categories.docs.map(item => {
        docs.push(item.toObject());
        return CategoryModel.find({
          category_id: {
            $in: item.child_categories
          }
        });
      })

      Promise.each(promises, (items, index) => {
        docs[index]['children'] = _.orderBy(items, ['order'], ['asc'])
      }).then(() => {
        categories.docs = docs
        const formatted = formatResponse(true, "", categories);
        return res.json(formatted);
      })

    })
  });

  router.post('/', (req, res) => {
    let category = new CategoryModel();

    const request = req.body

    for (let key in category) {
      if (request[key]) {
        category[key] = request[key];
      }
    }
    category.category_id = uuid.v1();

    const _save = () => {
      category.save()
        .then(data => {
          const formatted = formatResponse(true, system_notify.general.createSuccess, { category_id: data.category_id });
          res.json(formatted);
        })
        .catch(err => {
          err.code = 500;
          return next(err);
        });
    }

    if (request.parent_id) {
      CategoryModel.findOne({ category_id: request.parent_id }, (err, parent) => {
        if (!err) {
          const child_categories = _.union(parent.child_categories, [category.category_id]);

          // Update child ids
          parent.child_categories = child_categories;
          parent.save();

          return _save();
        }
      })
    } else {
      return _save();
    }

  });

  router.post("/image", (req, res) => {
    upload(req, res, error => {
      if (error) {
        error.code = 500;
        return next(error);
      }

      const response = formatResponse(true, system_notify.general.uploadSuccess, null);
      res.json(response);
    });
  })

  router.get('/:category_id', (req, res, next) => {
    CategoryModel.findOne(
      { category_id: req.params.category_id },
      (err, category) => {
        if (err) {
          err.code = 500;
          return next(err);
        }
        if (category) {
          const formatted = formatResponse(true, "", category);
          return res.json(formatted);
        } else {
          const error = new Error(system_notify.general.notFound);
          error.code = 404;
          return next(error);
        }
      })
  });
  router.get("/:category_id/image", (req, res, next) => {
    CategoryModel.findOne(
      { category_id: req.params.category_id },
      (error, category) => {
        if (error) {
          error.code = 500;
          return next(error);
        }

        if (category) {
          const options = {
            root: IMAGE_DIR
          }

          const image = category.image_url;

          res.sendFile(image, options, error => {
            if (error) {
              error.code = 500;
              return next(error);
            }
          });
        } else {
          const error = new Error(system_notify.general.notFound);
          error.code = 404;
          return next(error);
        }
      }
    );
  })

  router.patch('/:category_id', (req, res, next) => {
    const request = req.body;
    const params = req.params

    CategoryModel.findOne({ category_id: params.category_id }, (err, category) => {
      if (err) {
        err.code = 500;
        return next(err);
      }

      const oldParentId = category.parent_id;

      if (category) {
        category.updated_time = Date.now();

        let categoryCompose = Object.assign(category, request);

        if (!request.parent_id) {
          categoryCompose.parent_id = null;
        } else {
          if (mainCategories[params.category_id.toUpperCase()] != undefined) {
            const error1 = new Error('Nó đã là một danh mục cha, nó không có bất kỳ danh mục cha nào khác');
            error1.code = 400;
            return next(error1);
          }
        }

        const newParentId = categoryCompose.parent_id;

        categoryCompose.save((err, updatedCategory) => {

          if (err) {
            err.code = 500;
            return next(err);
          } else {

            // Remove child id from previous parent
            CategoryModel.update({
              category_id: oldParentId
            }, {
                $pullAll: {
                  child_categories: [params.category_id]
                }
              }, (err, response => {

                if (err) {
                  err.code = 500;
                  return next(err);
                } else {

                  // Add child id to new parent
                  CategoryModel.update({
                    category_id: newParentId
                  }, {
                      $push: {
                        child_categories: params.category_id
                      }
                    }, (err, response => {

                      if (err) {
                        err.code = 500;
                        return next(err);
                      }

                      const formatted = formatResponse(true, "", updatedCategory);
                      return res.json(formatted);
                    }))
                }
              }))


          }

        })

      } else {
        const error = new Error(system_notify.general.notFound);
        error.code = 404;
        return next(error);
      }
    });
  });

  router.delete('/:category_id', (req, res, next) => {
    const category_id = req.params.category_id;
    let notDelete = false;

    for (let key in mainCategories) {
      if (mainCategories[key] === category_id) {
        notDelete = true;
        break;
      }
    }

    if (notDelete) {
      const formatted = formatResponse(false, 'Đây là danh mục chính nên không thể xoá', {});
      return res.json(formatted);
    } else {
      CategoryModel.findOne({ category_id }, (err, category) => {
        if (err) {
          err.code = 500;
          return next(err);
        }

        if (category) {
          CategoryModel.remove({ category_id: req.params.category_id }, (err) => {
            if (err) {
              err.code = 500;
              return next(err);
            }

            const formatted = formatResponse(true, system_notify.general.removeSuccess, null);
            res.json(formatted);
          });
        } else {
          const error = new Error(system_notify.general.notFound);
          error.code = 404;
          return next(error);
        }
      });
    }
  });

  return router;
};
