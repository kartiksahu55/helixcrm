import Sales from "../Models/salesModel.js";
import LeadsRealEstate from "../Models/leadsModel/leadsRealEstateModel.js";
import LeadsBanking from "../Models/leadsModel/leadsBankingModel.js";
import AppError from "../Utils/errorUtils.js";

const createSales = async (req, res, next) => {
  try {
    const payload = req.body;

    let sales = null;

    // Check Lead sales exist
    const isLeadSalesExit = await Sales.findOne({ leadId: payload.leadId });
    if (isLeadSalesExit) {
      return next(new AppError("Sales Data of lead already exist", 400));
    }

    // Function check the lead valid or not
    const checkValidLeadAndCreateSales = async (modelName, id) => {
      // Check the Lead is valid or not
      const isLeadValid = await modelName.findOne({
        _id: id,
      });

      if (!isLeadValid) {
        return next(new AppError("Lead Doesn't exist", 400));
      }

      // Create Sales Data
      sales = await Sales.create(payload);

      // Update salesDataCreated In Lead data
      if (sales) {
        await modelName.findOneAndUpdate(
          { _id: id },
          { salesDataCreated: true }
        );
      }
    };

    // Check Valid Lead Sector Wise
    if (payload?.sector === "Real Estate") {
      await checkValidLeadAndCreateSales(LeadsRealEstate, payload.leadId);
    } else if (payload?.sector === "Banking") {
      await checkValidLeadAndCreateSales(LeadsBanking, payload.leadId);
    } else {
      return next(new AppError("Oops! Something went wrong.", 400));
    }

    res.status(200).json({
      success: "true",
      message: "New sales detail created successfully",
      data: sales,
    });
  } catch (error) {
    const errMessage = error.message || "Opps! Something went wrong.";
    return next(new AppError(errMessage, 500));
  }
};

const fetchSales = async (req, res, next) => {
  try {
    const { firmName, role, sector } = req.user;
    let sales = null;

    if (role === "super-admin" || role === "accountant") {
      sales = await Sales.find({ firmName });
    } else if (role === "admin") {
      sales = await Sales.find({ firmName, sector });
    } else {
      return next(new AppError("User Unauthorized!", 400));
    }

    res.status(200).json({
      success: "true",
      message: "Sales data fetched successfully!",
      data: sales,
    });
  } catch (error) {
    const errMessage = error.message || "Opps! Something went wrong.";
    return next(new AppError(errMessage, 500));
  }
};

const updateSales = async (req, res, next) => {
  try {
    const payload = req.body;
    const id = req.params.id;

    // console.log("payload: ", {...payload});
    // console.log("id: ", id);

    const sales = await Sales.findByIdAndUpdate({_id:id},{...payload})

    console.log("sales: ", sales);

    res.status(200).json({
      success: "true",
      message: "Sales data updated successfully!",
      data: "sales",
    });
  } catch (error) {
    const errMessage = error.message || "Opps! Something went wrong.";
    return next(new AppError(errMessage, 500));
  }
};

const deleteSales = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Check sales is valid or not
    const isValidSales = await Sales.findOne({ _id: id });
    if (!isValidSales) {
      return next(new AppError("Not a valid sales", 400));
    }

    // Remove sales data
    const sales = await Sales.findOneAndDelete({ _id: id });

    // Update Leads- salesDataCreated from true to false
    const updateSalesDataCreated = async (modelName, id) => {
      const response = await modelName.findOneAndUpdate(
        { _id:id },
        { salesDataCreated: false }
      );
      console.log("response: ", response);
    };

    console.log("sales: ", isValidSales);

    // Check Valid Lead Sector Wise
    if (sales?.sector === "Real Estate") {
      await updateSalesDataCreated(LeadsRealEstate, sales.leadId);
    } else if (sales?.sector === "Banking") {
      await updateSalesDataCreated(LeadsBanking, sales.leadId);
    } else {
      return next(new AppError("Oops! Something went wrong.", 400));
    }

    // Api response
    res.status(200).json({
      success: true,
      message: "Sales removed successfully",
      data: id,
    });
  } catch (error) {
    const errMessage = error.message || "Opps! Something went wrong.";
    // Error Api response
    return next(new AppError(errMessage, 500));
  }
};

export default { createSales, fetchSales, updateSales, deleteSales };
