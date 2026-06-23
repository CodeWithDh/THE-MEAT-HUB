import connectDb from "../config/db.js";

// Ensure table exists natively in case the database doesn't have it
connectDb(`
CREATE TABLE IF NOT EXISTS employees (
    employeeId VARCHAR(100) PRIMARY KEY,
    employeeName VARCHAR(255) NOT NULL,
    joiningDate DATE NOT NULL,
    leavingDate DATE DEFAULT NULL,
    salary INT NOT NULL
)
`).catch(err => console.error("Error creating employees table:", err));

export const getEmployeesPage = async (req, res) => {
    try {
        const employees = await connectDb("SELECT * FROM employees ORDER BY joiningDate DESC");
        res.render("employees", { employees });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).send("Error fetching employees");
    }
};

export const createEmployee = async (req, res) => {
    const { employeeId, employeeName, joiningDate, salary } = req.body;
    try {
        await connectDb(
            "INSERT INTO employees (employeeId, employeeName, joiningDate, salary) VALUES (?, ?, ?, ?)",
            [employeeId, employeeName, joiningDate, salary]
        );
        res.redirect("/employes");
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).send("Error adding employee");
    }
};

export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { employeeName, leavingDate, salary } = req.body;
    try {
        await connectDb(
            "UPDATE employees SET employeeName = ?, leavingDate = ?, salary = ? WHERE employeeId = ?",
            [employeeName, leavingDate || null, salary, id]
        );
        res.redirect("/employes");
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).send("Error updating employee");
    }
};

export const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        await connectDb("DELETE FROM employees WHERE employeeId = ?", [id]);
        res.redirect("/employes");
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).send("Error deleting employee");
    }
};
