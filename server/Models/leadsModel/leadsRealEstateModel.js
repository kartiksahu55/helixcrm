import { Schema, model } from "mongoose";

const realEstateLeadsSchema = new Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
    },
    lName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },

    phone: {
      type: Number,
      required: true,
      trim: true,
    },

    firmName: {
      type: String,
      required: true,
      default: "Referral Program",
    },

    sector: {
      type: String,
      required: true,
      default: "Real Estate",
    },

    leadRepresentative: {
      _id: { type: String, trim: true },
      name: { type: String, trim: true },
    },

    projectName: {
      type: String,
      trim: true,
    },

    leadSource: {
      type: String,
      trim: true,
      default: "Digital",
    },

    leadStatus: {
      type: String,
      trim: true,
      default: "Initial",
    },

    preference: {
      type: String,
      trim: true,
    },

    budget: {
      type: "String",
      trim: true,
    },

    preferredLocation: {
      type: String,
      trim: true,
    },

    nextActionDate: {
      type: String,
      trim: true,
    },

    activities: {
      type: Array,
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: [100, "Maximum length is 100 characters"],
    },

    salesDataCreated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const LeadsRealEstate = model("LeadsRealEstate", realEstateLeadsSchema);

export default LeadsRealEstate;
