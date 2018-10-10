const uuid = require("uuid");

const UsermodelAction = require("../models/UserActionModel");

/**
 * Upsert the actions
 * @param data
 * @returns promise
 */
const upsertActions = data => {
  const { user_id } = data;

  return UsermodelAction.findOneAndUpdate({ user_id }, data, {
    upsert: true,
    new: true
  }).exec();
};

/**
 *
 * @param user_id
 * @return promise
 */
const getCustomerActions = filter => {
  return UsermodelAction.findOne(filter).exec();
};

const getAmountOfCustomerActions = (filter = {}) => {
  return UsermodelAction.count(filter).exec(() => function (data) { });
};

const updateActions = actions => {
  const { user_id } = actions;
  return UsermodelAction.update({ user_id }, actions).exec();
}


module.exports = {
  upsertActions,
  getCustomerActions,
  getAmountOfCustomerActions,
  updateActions
}
