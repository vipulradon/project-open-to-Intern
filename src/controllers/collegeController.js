const collegeModel = require("../models/collegeModel");

function validateName($name) {
    var nameReg = /^[A-Za-z]*$/;
    if (!nameReg.test($name)) {
        return false;
    } else {
        return true;
    }
}




const createCollege = async function(req,res){
let collegeData = req.body;
if(!collegeData.name)return res.status(400).send({status:false,msg:"CollegeName is A Mandatory Field"});
if(!validateName(collegeData.name))return res.status(400).send({status:false,msg:"Invalid College Name"});
let uniqueCollege = await collegeModel.findOne({name:collegeData.name});
if(uniqueCollege)return res.status(400).send({status:false,msg:"Please Enter A Different College Name,College Already Exists"});



if(!collegeData.fullName)return res.status(400).send({status:false,msg:"College FullName Is A Mandatory Field"});
// if(!validateName(collegeData.fullName))return res.status(400).send({status:false,msg:"Invalid College fullName"});


if(!collegeData.logoLink)return res.status(400).send({status:false,msg:"Please Provide A College LogoLink,Its A Mandatory Field"});
let savedCollege = await collegeModel.create(collegeData);
return res.status(200).send({status:true,data:savedCollege});

}




module.exports.createCollege = createCollege;
