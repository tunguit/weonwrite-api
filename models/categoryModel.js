const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const paginate = require('mongoose-paginate');

const categorySchema = new mongoose.Schema({
	category_id: {
		type: String,
		index: {
			unique: true
		},
		required: true,
		trim: true
	},
	category_name: {
		type: String,
		required: [true, 'Category name is required']
	},
	parent_id: {
		type: String,
		trim: true
	},
  child_categories: [{
	  type: String,
    trim: true
  }],
  description: String,
  image_url: String,
  order: {
    type: Number,
    default: 1
  }
});

categorySchema.plugin(timestamps);
categorySchema.plugin(paginate);

module.exports = mongoose.model("Category", categorySchema);
