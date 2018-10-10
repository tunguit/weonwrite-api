const defaultLimit = 12;
const defautCurrentPage = 1;

const getQueryForPaging = (req, res, next) => {
  try {
    // For paging
    const perPage = req.query["per_page"]
      ? Number.parseInt(req.query["per_page"])
      : defaultLimit;
    const page = req.query["page"] ? Number.parseInt(req.query["page"]) : 0;

    req.perPage = perPage;
    req.page = page;
    next();
  } catch (error) {
    error.code = 500;
    return next(error);
  }
};

const getPagingParams = req => {
  if (!req || !req.query) {
    return {
      page: defautCurrentPage,
      limit: defaultLimit
    }
  }
  const query = req.query
  const limit = query && query["per_page"] ? Number.parseInt(query["per_page"]) : defaultLimit;
  const page = query && query["page"] ? Number.parseInt(query["page"]) : defautCurrentPage;
  return {
    page,
    limit,
    sort: {
      order: 'asc',
      createdAt: 'desc'
    }
  }
};

const getTextSearchConditions = (keyword, fields) => {
  const _keywordsRegex = (keyword) => {
    const result = []
    if (keyword && keyword.trim() != '') {
      const keywords = removeDiacritics(keyword.trim()).split(' ')
      for (const i in keywords) {
        const word = keywords[i]
        if (word.trim() != '') {
          result.push(
            new RegExp(word.trim(), 'i')
          )
        }
      }
    }
    return result
  }

  const result = []
  for (const i in fields) {
    const field = fields[i]
    const item = {}
    item[field] = {
      $all: _keywordsRegex(keyword)
    }
    result.push(item)
  }
  return result
}

module.exports = {
  getQueryForPaging,
  getPagingParams,
  getTextSearchConditions
};
