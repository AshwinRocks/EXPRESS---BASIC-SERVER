const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data.json");

function readData() {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw).applicationData;
}

function writeData(applicationData) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({applicationData}, null, 2))
}

function sendSuccess(res, status, data) {
    res.status(status).json({
        status: "success",
        data: data
    });
};

function sendError(res, status, msg) {
    res.status(status).json({
        status: "fail",
        error: msg
    })
}

exports.getAllApplications = (req, res) => {
    const { status, sort, page, limit } = req.query;

    let results = readData();
    
    if (status) {
        console.log("status", status)
        results = results.filter(app => app.status === status);
    }

    if (page && limit) {
        const pageNum = Number(page);
        const limitNum = Number(limit);

        const start = (pageNum-1) *limitNum;

        results = results.slice(start, start + limitNum)
    }

    sendSuccess(res, 200, results);
};

exports.addApplication = (req, res) => {
    const { name, orgName, status } = req.query;

    const applications = readData();

    if (!name || !orgName) {
        sendError(res, 500, "Name and org name is required");
    }

    const nextId = applications &&
     applications.length > 0 ? Math.max(...applications.map(d => d.id)) + 1 : 1;

    const newApplication = {
        id: nextId,
        name: name,
            status: status || "pending",
            orgName: orgName
    };

    applications.push(newApplication);
    writeData(applications);

    sendSuccess(res, 200, "Application added");
};

exports.deleteApplication = (req, res) => {
    const applicationData = readData();
    
    if (!req.params.id) {
        sendError(res, 500, "ID is required")
    }
    const id = Number(req.params.id);        
    const deleteIndex = applicationData.findIndex(d => d.id === id);
    if (deleteIndex === -1) {
        sendError(res, 404, "Record not found");
    }
    applicationData.splice(deleteIndex, 1);
    writeData(applicationData);
    sendSuccess(res, 200, "Deleted the record successfully");
};

exports.editApplication = (req, res) => {
    const id = Number(req.params.id);

    console.log("req", req);

    const { orgName, status, name } = req.body;

    const applications = readData();

    const application = applications.find(app => app.id === id);

    if (!application) {
        sendError(res, 404, "Record not found");
    }

    if (orgName !== undefined) application.orgName === orgName;
    if (name !== undefined) application.name === name;
    if (status !== undefined) application.status === status;

    console.log("applications", applications)

    writeData(applications);
    sendSuccess(res, 200, applications)
}