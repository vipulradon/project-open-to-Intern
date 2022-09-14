const collegeModel = require("../models/collegeModel");
const validator = require("upper-case-first");
const { find } = require("../models/internModel");
const internModel = require("../models/internModel");
function validateName($name) {
   
   
    var nameReg = /^[A-Za-z]*$/;
    if (!nameReg.test($name)) {
        return false;
    } else {
        return true;
    }
}




const createCollege = async function (req, res) {
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


const getCollegeDetails = async function(req,res){
let college = req.query.collegeName;
if(!college)return res.status(400).send({ status: false, msg: "Please Provide Query Filter" });
college.toUpperCase();
req.query.isDeleted = false;
let collegeDetails = await collegeModel.findOne(req.query).select({_id:1});
let collegeid = collegeDetails._id;
let interns = await internModel.find({collegeId:collegeid})


}








module.exports.createCollege = createCollege;
