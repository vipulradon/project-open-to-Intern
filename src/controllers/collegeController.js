const collegeModel = require("../models/collegeModel");
const { find } = require("../models/internModel");
const internModel = require("../models/internModel");
const validator = require("validator");

// =============================================================REGEX FOR NAME VALIDATION============================================================================
function validateName($name) {
    var nameReg = /^[A-Za-z]*$/;
    if (!nameReg.test($name)) {
        return false;
    } else {
        return true;
    }
}



// ==============================================================ROUTE HANDLER FOR CREATE COLLEGE API=====================================================================


const createCollege = async function (req, res) {
    try {
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, data: "Request Body Cant be Blank" })
        let collegeData = req.body;

        if (!collegeData.name) return res.status(400).send({ status: false, data: "CollegeName is A Mandatory Field" });
        if (!validateName(collegeData.name)) return res.status(400).send({ status: false, data: "Invalid College Name" });
        collegeData.name.toUpperCase();
        let uniqueCollege = await collegeModel.findOne({ name: collegeData.name });
        if (uniqueCollege) return res.status(400).send({ status: false, data: "Please Enter A Different College Name,College Already Exists" });



        if (!collegeData.fullName) return res.status(400).send({ status: false, data: "College FullName Is A Mandatory Field" });



        if (!collegeData.logoLink) return res.status(400).send({ status: false, data: "Please Provide A College LogoLink,Its A Mandatory Field" });
        if (!validator.isURL(collegeData.logoLink)) return res.status(400).send({ status: false, data: "Invalid logoLink" });

        let savedCollege = await collegeModel.create(collegeData);
        return res.status(201).send({ status: true, data: savedCollege });
    }
    catch (error) {
        return res.status(500).send({ status: false, data: "Internal Server Error" })
    }
}


// ========================================================ROUTE HANDLER FOR GET COLLEGE API========================================================================


const getCollegeDetails = async function (req, res) {
    try {
        let college = req.query.collegeName;
        if (!college) return res.status(400).send({ status: false, data: "Please Provide Query Filter" });
        if (!validateName(college)) return res.status(400).send({ status: false, data: "Invalid College Name" });
        let college1 = college.toUpperCase();

        req.query.isDeleted = false;
        let collegeDetails = await collegeModel.findOne({ name: college1 }).select({ name: 1, fullName: 1, logoLink: 1 });
        if (!collegeDetails) return res.status(404).send({ status: false, data: "College Not Found" });
        let collegeid = collegeDetails._id;


        let internlist = await internModel.find({ collegeId: collegeid }).select({ name: 1, email: 1, mobile: 1 });
        if (internlist.length == 0) {
            internlist = "No Interns Have Applied For this College!!"
        }

        let result = {
            name: collegeDetails.name,
            fullName: collegeDetails.fullName,
            logoLink: collegeDetails.logoLink,
            interns: internlist
        }
        return res.status(200).send({ status: true, data: result });
    }
    catch (error) {
        return res.status(500).send({ status: false, data: "Internal Server Error" })
    }
};











module.exports.createCollege = createCollege;
module.exports.getCollegeDetails = getCollegeDetails;
