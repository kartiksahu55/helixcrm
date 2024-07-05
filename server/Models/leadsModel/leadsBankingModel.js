import { Schema, model } from "mongoose";

const bankingLeadsSchema = new Schema(
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
      default: "Banking",
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

    budget: {
      type: "String",
      trim: true,
    },

    caseType: {
      type: String,
      trim: true,
    },

    bankName: {
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

const LeadsBanking = model("LeadsBanking", bankingLeadsSchema);

export default LeadsBanking;
