const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
// const slug = require("slug");
// const removeDiacritics = require("diacritics").remove;
// const paginate = require('mongoose-paginate');

const campaignSchema = new mongoose.Schema({
    campaign_id: {
        type: String,
        index: {
            unique: true
        },
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    title_no_diacritics: String,
    title_slug: String,
    short_description: {
        type: String,
        default: ''
    },
    short_description_no_diacritics: String,
    full_description: {
        type: String,
        default: ''
    },
    full_description_no_diacritics: String,
    attachments: [{
        type: String
    }],
    category_id: {
        type: String,
        required: true,
        trim: true
    },
    categories: [{
        type: String
    }],
    belong_to_campaign_id: String,
    order: {
        type: Number,
        default: 1
    },
    views: Number,
    shares: Number,
    favorites: Number,
    prints: Number,
    emails: Number,
});

campaignSchema.plugin(timestamps);
// campaignSchema.plugin(paginate);

// campaignSchema.pre("save", function (next) {
//     this.title_slug = slug(this.title.toLowerCase());
//     this.title_no_diacritics = removeDiacritics(this.title);
//     this.short_description_no_diacritics = removeDiacritics(this.short_description);
//     this.full_description_no_diacritics = removeDiacritics(this.full_description);
//     next();
// });

module.exports = mongoose.model("Campaign", campaignSchema);