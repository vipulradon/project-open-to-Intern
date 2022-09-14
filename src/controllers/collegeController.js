const collegeModel = require("../models/collegeModel");
const { find } = require("../models/internModel");
const internModel = require("../models/internModel");


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
        if (!req.body) return res.status(400).send({ status: false, msg: "Request Body Cant be Blank" })
        let collegeData = req.body;

        if (!collegeData.name) return res.status(400).send({ status: false, msg: "CollegeName is A Mandatory Field" });
        if (!validateName(collegeData.name)) return res.status(400).send({ status: false, msg: "Invalid College Name" });
        collegeData.name.toUpperCase();
        let uniqueCollege = await collegeModel.findOne({ name: collegeData.name });
        if (uniqueCollege) return res.status(400).send({ status: false, msg: "Please Enter A Different College Name,College Already Exists" });



        if (!collegeData.fullName) return res.status(400).send({ status: false, msg: "College FullName Is A Mandatory Field" });



        if (!collegeData.logoLink) return res.status(400).send({ status: false, msg: "Please Provide A College LogoLink,Its A Mandatory Field" });

        let savedCollege = await collegeModel.create(collegeData);
        return res.status(200).send({ status: true, data: savedCollege });
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }
}


// ========================================================ROUTE HANDLER FOR GET COLLEGE API========================================================================


const getCollegeDetails = async function (req, res) {
    try {
        let college = req.query.collegeName;
        if (!college) return res.status(400).send({ status: false, msg: "Please Provide Query Filter" });
        if (!validateName(college)) return res.status(400).send({ status: false, msg: "Invalid College Name" });
        college.toUpperCase();

        req.query.isDeleted = false;
        let collegeDetails = await collegeModel.findOne({ name: college }).select({ name: 1, fullName: 1, logoLink: 1 });
        if (!collegeDetails) return res.status(404).send({ status: false, msg: "College Not Found" });
        let collegeid = collegeDetails._id;


        let internlist = await internModel.find({ collegeId: collegeid }).select({ name: 1, email: 1, mobile: 1 });

        let result = collegeDetails._doc;
        result.interns = internlist;
        delete result._id;
        return res.status(200).send({ status: true, data: result });
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }
};











module.exports.createCollege = createCollege;
module.exports.getCollegeDetails = getCollegeDetails;
