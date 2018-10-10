const boolean = require("boolean");

const CampaignModel = require("../models/Campaign");

/**
 *
 * @param query List
 * @param promise
 */
const getCampaignList = (conditions, perPage, page) => {
  return CampaignModel.find(conditions)
    .limit(perPage)
    .skip(perPage * page)
    .sort({ order: "asc", createdAt: "desc" });
}

/**
 *
 * @param conditions
 * @return promise
 */
const getCampaignCount = conditions => {
  return CampaignModel.count(conditions).exec();
};

/**
 *
 * @param value
 * @param paging
 * @return promise
 */
const findCampaign = (value, paging = { perPage: 10, page: 0 }) => {
  const { perPage, page } = paging;
  return CampaignModel.find({
    $or: [
      {title_no_diacritics: { $regex: value, $options: "i" }},
      {full_description_no_diacritics: { $regex: value, $options: "i" }}
    ]
  })
    .limit(perPage)
    .skip(perPage * page)
    .sort({ createdAt: "desc" })
    .exec();
}

const findCampaignAmount = value => {
  return CampaignModel.count({
    title_no_diacritics: { $regex: value, $options: "i" }
  }).exec();
}

module.exports = {
  getCampaignList,
  getCampaignCount,
  findCampaign,
  findCampaignAmount
};
