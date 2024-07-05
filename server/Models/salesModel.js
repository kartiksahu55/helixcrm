import { Schema, model } from "mongoose";

const salesSchema = new Schema(
  {
    leadId: {
      type: String,
      trim: true,
      required: true,
    },

    leadRepresentative: {
      _id: { type: String, trim: true, required: true },
      name: { type: String, trim: true, required: true },
    },

    sector: {
      type: String,
      required: true,
    },

    firmName: {
      type: String,
      required: true,
      default: "Referral Program",
    },

    fName: {
      type: String,
      trim: true,
      required: true,
    },

    lName: {
      type: String,
      trim: true,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
    },

    leadSource: {
      type: String,
      trim: true,
    },

    projectName: {
      type: String,
      trim: true,
      required: true,
    },

    // Real Estate Sales Details
    realEstateSales: {
      bookingDate: {
        type: String,
        trim: true,
      },

      salesValue: {
        type: Number,
      },

      unitAlloted: {
        type: String,
        trim: true,
      },

      dimension: {
        type: String,
        trim: true,
      },

      discount: {
        type: String,
        trim: true,
      },

      discountAfterTds: {
        type: String,
        trim: true,
      },

      dateOfDiscountPayment: {
        type: String,
        trim: true,
      },

      brokerageAmt: {
        type: Number,
      },

      brokerageInvoiceDate: {
        type: String,
        trim: true,
      },

      brokerageReceivingDate: {
        type: String,
        trim: true,
      },

      incentiveAmt: {
        type: Number,
      },

      incentivePaymentDate: {
        type: String,
        trim: true,
      },

      homeLoan: {
        type: String,
        trim: true,
      },
    },

    // Banking Sales Details
    bankingSales: {
      disbursementDate: {
        type: String,
        trim: true,
      },

      sanctionAmt: {
        type: Number,
      },

      fileNumber: {
        type: Number,
      },

      bankName: {
        type: String,
        trim: true,
      },

      totalDisbursement: {
        type: Number,
      },

      expectedTotalDisbursement: {
        type: Number,
      },

      expectedIncentiveFromBank: {
        type: Number,
      },

      disbursementSlab: {
        type: Number,
      },

      incentiveAmt: {
        type: Number,
      },

      incentivePaymentDate: {
        type: String,
        trim: true,
      },

      advanceIncentive: {
        type: Number,
      },

      bsaIncentiveAmt: {
        type: Number,
      },

      bsaIncentiveDate: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

const Sales = model("Sales", salesSchema);

export default Sales;
