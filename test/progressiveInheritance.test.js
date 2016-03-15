var chai = require("chai"),
    expect = require("chai").expect,
    db = require("../src/scripts")(require("./progressiveGraphTest.json")),
    data = [
        {
            "id": 1,
            "task_id": 1,
            "assigned_to": 1,
            "description": null,
            "time_allocated": 12600000,
            "created_by": 1,
            "created_on": "2016-03-09 13:50:59",
            "deleted": 0,
            "Task": {
                "id": 1,
                "title": "Lay foundations",
                "notes": null,
                "deadline": "2016-03-31 16:21:00",
                "task_status_id": 1,
                "created_by": 1,
                "created_on": "2016-03-09 07:21:43",
                "deleted": 0,
                "ProjectTask": {
                    "id": 1,
                    "title": "Lay foundations",
                    "task_status_id": 1,
                    "created_by": 1,
                    "created_on": "2016-03-09 07:21:43",
                    "deleted": 0,
                    "task_id": 1,
                    "project_id": 1,
                    "Project": {
                        "id": 1,
                        "entity_id": 3,
                        "title": "build a big tower test",
                        "project_status_id": 1,
                        "deadline": "2016-04-24 04:00:00",
                        "created_by": 1,
                        "created_on": "2016-03-09 04:28:33",
                        "deleted": 0
                    }
                }
            },
            "Times": []
        },
        {
            "id": 3,
            "task_id": 2,
            "assigned_to": 1,
            "description": "Keep on believe'n",
            "time_allocated": 4800000,
            "created_by": 1,
            "created_on": "2016-03-09 15:59:26",
            "deleted": 0,
            "Task": {
                "id": 2,
                "title": "My first quick task - test",
                "notes": null,
                "deadline": "2016-03-31 19:00:00",
                "task_status_id": 1,
                "created_by": 1,
                "created_on": "2016-03-09 15:44:16",
                "deleted": 0,
                "QuickTask": {
                    "task_id": 2,
                    "entity_id": 3
                }
            },
            "Times": []
        }
    ];

describe("should be able to progressively generate children", function() {
    it("should create Task", function() {
        db.Task.post(data[0].Task);

        expect(db.Task.get(data[0].Task.id)).to.exist;
    });

    it("should create ProjectTask even though Task exists", function() {
        db.ProjectTask.post(data[0].Task.ProjectTask);

        expect(db.ProjectTask.get(data[0].Task.ProjectTask.id)).to.exist;
    })
});