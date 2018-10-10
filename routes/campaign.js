/** server/controllers/article.ctrl.js*/
var NewsModel = require('./../models/Campaign')
var User = require('./../models/User')
var express = require('express');
var router = express.Router();
var config = require("../configs/apiconfig");
const uuid = require("uuid");
const formatResponse = require("../configs/formatReponse");
const _ = require("lodash");
const boolean = require("boolean");
const { uploadMultiFiles } = require("../configs/upload");
const NewsModelActions = require("../modelActions/CampaignModelAction");
const system_notify  = require("../configs/messages_en");
const paging  = require("../configs/pagination");

const IMAGE_DIR = "./uploads/news";
const NAME = "upload";

const upload = uploadMultiFiles(IMAGE_DIR, NAME);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('dsad');
});

/* POST CAMPAIGN. */
router.post('/new-campaign', function(req, res, next) {

    let { content, title, description } = req.body;

    saveCampaign({ content, title, description, thumb_image: '' })

    function saveCampaign(obj) {
            new Campaign(obj).save((err, campaign) => {
                if (err)
                    res.send(err)
                else if (!campaign)
                    res.send(400)
                else {
                    return campaign.addAuthor(req.body.author_id).then((_campaign) => {
                        return res.send(_campaign)
                    })
                }
                next()
            })
        }
});

/* POST CAMPAIGN. */
router.get('/get-campaign', function(req, res, next) {

    Campaign.find(req.params.id)
        .populate('title').exec((err, campaign)=> {
            if (err)
                res.send(err)
            else if (!campaign)
                res.send(404)
            else
                res.send(campaign)
            next()            
        })
});

router.get('/', (req, res, next) => {
    let {
      keyword
    } = req.query
    let conditions = {}
    if (req.query["featured"] && boolean(req.query["featured"])) {
      conditions.featured = req.query["featured"];
    }

    if (keyword) {
      const textSearchConditions = paging.getTextSearchConditions(keyword, [
        'title_no_diacritics',
        'short_description_no_diacritics',
        'full_description_no_diacritics'
      ])
      conditions.$or = textSearchConditions
    }

    let options = paging.getPagingParams(req)

    options.sort = {
      approved: 'asc',
      featured: 'desc',
      order: 'asc',
      createdAt: 'desc',
    }

    if (req.query.sort) {
      options.sort = Object.assign(JSON.parse(req.query.sort), options.sort)
    }

    NewsModel.paginate(
      conditions,
      options,
      (err, news) => {
        if (err) {
          err.code = 500;
          return next(err);
        }

        const formatted = formatResponse(true, "", news);
        res.json(formatted);
      });
  });

  router.get("/count", (req, res, next) => {
    let conditions = {};

    if (req.query["featured"] && boolean(req.query["featured"])) {
      conditions.featured = req.query["featured"];
    }

    NewsModelActions.getNewsCount(conditions)
      .then(count => {
        const formatted = formatResponse(true, "", {
          total: count
        });
        res.json(formatted);
      })
      .catch(error => {
        error.code = 500;
        return next(error);
      });
  });

  router.get('/treatment_news_list', (req, res, next) => {
    NewsModel.find({
      category_id: 'treatment'
    }, {
        category_id: 1,
        news_id: 1,
        title: 1
      }, (err, docs) => {
        if (err) {
          return next(err)
        }
        const formatted = formatResponse(true, '', docs);
        res.json(formatted);
      })
  })

  router.get("/:news_id", (req, res, next) => {
    NewsModel.findOne({
      news_id: req.params.news_id
    }, (err, news) => {
      if (err) {
        err.code = 500;
        return next(err);
      }

      if (news) {
        const formatted = formatResponse(true, "", news);
        return res.json(formatted);
      } else {
        const error = new Error(system_notify.general.notFound);
        error.code = 404;
        return next(error);
      }
    })
  });

  router.get('/:news_id/:attachment_name', (req, res, next) => {
    const attachmentName = req.params.attachment_name;

    NewsModel.findOne({
      news_id: req.params.news_id
    }, (error, news) => {
      if (error) {
        error.code = 500;
        return next(error);
      }

      if (news) {
        const options = {
          root: IMAGE_DIR
        }

        const image = news.attachments.find(element => {
          return element === attachmentName;
        });

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
    });
  })

  router.post('/', (req, res, next) => {
    const news = new NewsModel();

    for (let key in news) {
      if (req.body[key]) {
        news[key] = req.body[key];
      }
    }

    // check the main category (category_id) with the categories field
    if (!news.categories || news.categories.length == 0) {
      news.categories = [];
    }

    news.news_id = uuid.v1();

    news.save()
      .then(data => {
        const formatted = formatResponse(true, system_notify.general.createSuccess, data);
        res.json(formatted);
      })
      .catch(err => {
        err.code = 500;
        return next(err);
      });
  });

  router.post('/upload', (req, res, next) => {
    upload(req, res, error => {
      if (error) {
        error.code = 500;
        return next(error);
      }

      const response = formatResponse(true, system_notify.general.uploadSuccess, req.files);
      res.json(response);
    });
  });

  router.patch('/:news_id', (req, res, next) => {
    NewsModel.findOne({
      news_id: req.params.news_id
    }, (err, news) => {
      if (err) {
        err.code = 500;
        return next(err);
      }

      if (news) {
        const newsCompose = Object.assign(news, req.body);

        // check the main category (category_id) with the categories field
        if (!newsCompose.categories || newsCompose.categories.length == 0) {
          newsCompose.categories = [];
        }

        newsCompose.save((err, updatednews) => {
          if (err) {
            err.code = 500;
            return next(err);
          }
          const formatted = formatResponse(true, system_notify.general.updateSuccess, updatednews);
          return res.json(formatted);
        })
      } else {
        const error = new Error(system_notify.general.notFound);
        error.code = 404;
        return next(error);
      }
    });
  });

  router.delete('/:news_id', (req, res, next) => {
    NewsModel.findOne({
      news_id: req.params.news_id
    }, (err, news) => {
      if (err) {
        err.code = 500;
        return next(err);
      }

      if (news) {
        NewsModel.remove({
          news_id: req.params.news_id
        }, (err) => {
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
  });

  router.post("/:news_id/statistics", (req, res, next) => {
    const news_id = req.params.news_id;
    const type = req.query.type;
    if (!news_id) {
      const err = new Error(system_notify.general.missingParam);
      err.code = 404;
      return next(err);
    }
    NewsModel.findOne({
      news_id
    }).then(news => {
      if (news) {
        let count = 0;
        switch (type) {
          case 'shares':
            count = news.shares || 0;
            news.shares = (count + 1);
            break;
          case 'favorites':
            count = news.favorites || 0;
            news.favorites = (count + 1);
            break;
          case 'prints':
            count = news.prints || 0;
            news.prints = (count + 1);
            break;
          case 'emails':
            count = news.emails || 0;
            news.emails = (count + 1);
            break;
          default:
            count = news.views || 0;
            news.views = (count + 1);
            break;
        }
        NewsModel.update({
          news_id
        }, news).then(data => {
          const formatted = formatResponse(true, system_notify.general.updateSuccess, news);
          return res.json(formatted);
        }).catch(err => {
          err.code = 500;
          return next(err);
        });
      } else {
        const err = new Error(system_notify.general.notFound);
        err.code = 404;
        return next(err);
      }
    })
  });

module.exports = router;
