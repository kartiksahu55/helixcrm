import LeadsRealEstate from "../Models/leadsModel/leadsRealEstateModel.js";
import LeadsBanking from "../Models/leadsModel/leadsBankingModel.js";
import AppError from "../Utils/errorUtils.js";

// Start create new leads
const createLeads = async (req, res, next) => {
  try {
    const {
      fName,
      lName,
      phone,
      email,
      sector,
      projectName,
      preference,
      budget,
      preferredLocation,
      leadSource,
      caseType,
      bankName,
      leadStatus,
      leadRepresentative,
      feedback,
    } = req.body;
    const { firmName } = req.user;
    let leads = null;

    // Start initializing lead sector to create new lead
    if (sector === "Real Estate") {
      const payload = {
        fName,
        lName,
        phone,
        email,
        projectName,
        preference,
        budget,
        preferredLocation,
        leadSource,
        leadStatus,
        leadRepresentative,
        nextActionDate: "",
        feedback,
        firmName,
      };

      // Call createLeadExecute to Create New Lead for Real Estate Sector
      await createLeadExecute(LeadsRealEstate, payload);
    } else if (sector === "Banking") {
      // Create Lead for Banking Sector
      const payload = {
        fName,
        lName,
        phone,
        email,
        projectName,
        leadSource,
        leadStatus,
        leadRepresentative,
        caseType,
        bankName,
        nextActionDate: "",
        feedback,
        firmName,
      };

      // Call createLeadExecute to Create New Lead for Real Estate Sector
      await createLeadExecute(LeadsBanking, payload);
    } else {
      return next(new AppError("Interior Lead Creation is On Hold!", 400));
    }

    // This function create new Lead
    async function createLeadExecute(modelName, payload) {
      // Check if phone number exist
      const isPhoneExist = await modelName.findOne({
        phone: payload.phone,
      });

      if (isPhoneExist) {
        return next(new AppError("Phone number already exist!", 400));
      }

      // Create new lead
      leads = await modelName.create(payload);
    }

    // API Response
    res.status(200).json({
      success: true,
      message: `One New lead registered successfully for ${sector}`,
      data: leads,
    });
  } catch (error) {
    const errMessage = error.message || "Opps! Something went wrong.";
    return next(new AppError(errMessage, 500));
  }
};
// End create new Leads

// Start fetch leads
const fetchLeads = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError("Unauthenticated!"));
    }
    const { id, role, sector, firmName } = req.user;
    console.log("User Details: ", req.user);

    let leads = null;

    console.log(id);

    if (role === "super-admin") {
      const realEstateLeads = await LeadsRealEstate.find({ firmName });
      const bankingLeads = await LeadsBanking.find({ firmName });
      leads = [...realEstateLeads, ...bankingLeads];
    } else if (role === "admin") {
      if (sector === "Real Estate") {
        leads = await LeadsRealEstate.find({ firmName });
      } else if (sector === "Banking") {
        leads = await LeadsBanking.find({ firmName });
      }
    } else {
      if (sector === "Real Estate") {
        leads = await LeadsRealEstate.find({ firmName });
      } else if (sector === "Banking") {
        leads = await LeadsBanking.find({ firmName });
      }
      console.log(leads);
      leads = leads.filter((e) => e.leadRepresentative._id === id);
    }

    console.log("Lead Details", leads);

    res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    const errMessage = error.message || "Opps! Something went wrong.";
    return next(new AppError(errMessage, 500));
  }
};
// End fetch Leads

// Start update leads
const updateLeads = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    let leads = null;
    const {
      fName,
      lName,
      phone,
      email,
      sector,
      projectName,
      preference,
      budget,
      preferredLocation,
      leadSource,
      caseType,
      bankName,
      leadStatus,
      leadRepresentative,
      nextActionDate,
      feedback,
    } = req.body;

    if (sector === "Real Estate") {
      const payload = {
        fName,
        lName,
        phone,
        email,
        projectName,
        preference,
        budget,
        preferredLocation,
        leadSource,
        leadStatus,
        leadRepresentative,
        nextActionDate,
        feedback,
      };

      await updateLeadExecute(LeadsRealEstate, payload, leadId);
    } else if (sector === "Banking") {
      const payload = {
        fName,
        lName,
        phone,
        email,
        projectName,
        caseType,
        bankName,
        leadSource,
        leadStatus,
        leadRepresentative,
        nextActionDate,
        feedback,
      };

      await updateLeadExecute(LeadsBanking, payload, leadId);
    }

    // This function update lead
    async function updateLeadExecute(modelName, payload, id) {
      const isValidLead = await modelName.findById({ _id: id });
      if (!isValidLead) {
        return next(new AppError("Lead doesn't exist", 400));
      }
      // Update Lead data in database
      const response = await modelName.findOneAndUpdate(
        { _id: leadId },
        payload
      );

      if (response) {
        leads = { ...payload, _id: id };
      }
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: leads,
    });
  } catch (error) {
    console.log(error);
    const errMessage = error.message || "Oops! Something went wrong.";
    return next(new AppError(errMessage, 500));
  }
};
// End update leads

// Start Assign leads
const assignLeads = async (req, res, next) => {
  try {
    const payload = req.body;
    const leadId = req.params.id;
    const firmName = req.user.firmName;
    let leadAssigned = null;

    // return next(new AppError("This Feature is temporarily closed!", 400));

    if (payload.currentLeadSector === "Real Estate") {
      await assignLeadExecute(LeadsRealEstate, payload, leadId);
    } else if (payload.currentLeadSector === "Banking") {
      await assignLeadExecute(LeadsBanking, payload, leadId);
    }

    // function assign leads to Representative
    async function assignLeadExecute(modelName, payload, leadId) {
      let leadDetails = null;
      // Check Lead is valid or not
      if (payload.previouLeadSector === "Real Estate") {
        leadDetails = await checkValidLead(LeadsRealEstate, leadId);
      } else if (payload.previouLeadSector === "Banking") {
        leadDetails = await checkValidLead(LeadsBanking, leadId);
      } else if (payload.previouLeadSector === "Interiors") {
        return next(new AppError("Interior is currently unavailable!", 400));
      } else {
        return next(new AppError("Oops! Something went wrong", 400));
      }

      console.log("LeadRepresentative: ", payload.leadRepresentative);
      const leadRepresentative = payload.leadRepresentative;
      for (let i = 0; i < leadRepresentative.length; i++) {
        leadAssigned = await modelName.create({
          fName: leadDetails.fName,
          lName: leadDetails.lName,
          phone: leadDetails.phone,
          email: leadDetails.email,
          firmName,
          sector: payload.currentLeadSector,
          projectName: leadDetails.projectName,
          preference: leadDetails.preference ? leadDetails.preference : "",
          budget: leadDetails.budget ? leadDetails.budget : "",
          preferredLocation: leadDetails.preferredLocation
            ? leadDetails.preferredLocation
            : "",
          leadSource: leadDetails.leadSource,
          caseType: leadDetails.caseType ? leadDetails.caseType : "",
          bankName: leadDetails.bankName ? leadDetails.bankName : "",
          leadRepresentative: leadRepresentative[i],
          nextActionDate: "",
          actactivities: "",
          feedback: "",
        });
      }
    }

    // Function check is valid exist
    async function checkValidLead(modelName, id) {
      const isValidLead = await modelName.findOne({ _id: id });

      if (!isValidLead) {
        return next(new AppError("Lead a not valid", 400));
      }

      return isValidLead;
    }

    // const assignedData = { ...assign._doc, ...payload };

    console.log("leadAssigned: ", leadAssigned);

    if (!leadAssigned) {
      return next(new AppError("Something went wrong!", 400));
    }

    res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      data: leadAssigned,
    });
  } catch (error) {
    console.log(error);
    const errMessage = error.message || "Oops! Something went wrong.";
    return next(new AppError(errMessage, 500));
  }
};
// End Assign leads

// Start Delete leads
const deleteLeads = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const sector = req.body.sector;
    let deletedLead = null;

    if (sector === "Real Estate") {
      await deleteLeadExecute(LeadsRealEstate, leadId);
    } else if (sector === "Banking") {
      await deleteLeadExecute(LeadsBanking, leadId);
    } else {
      return next(new AppError("Interior is not accessible!", 400));
    }

    async function deleteLeadExecute(modelName, id) {
      // Check lead valid or not
      const isValidLead = await modelName.findById({ _id: id });
      if (!isValidLead) {
        return next(new AppError("Lead doesn't exist", 400));
      }

      // Delete Lead data in database
      deletedLead = await modelName.findByIdAndDelete({ _id: leadId });
    }

    // API Success Response
    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: deletedLead,
    });
  } catch (error) {
    const errMessage = error.message || "Oops! Something went wrong.";
    console.log(errMessage);
    return next(new AppError(errMessage));
  }
};
// End Delete leads

export default {
  createLeads,
  fetchLeads,
  updateLeads,
  assignLeads,
  deleteLeads,
};
