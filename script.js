// Load employees from localStorage if available, otherwise use an empty array
let employees = JSON.parse(localStorage.getItem('employees')) || [];

// Save employees to localStorage
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Display employees in the table
function displayEmployees() {
    const tbody = document.getElementById('employee-table-body');
    tbody.innerHTML = employees.map(emp => `
        <tr>
            <td>${emp.empId}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.salary}</td>
            <td>${emp.performance}</td>
            <td>
                <button class="btn" onclick="removeEmployee('${emp.empId}')">Remove</button>
                <button class="btn" onclick="promoteEmployee('${emp.empId}')">Promote</button>
            </td>
        </tr>
    `).join('');
    calculateDepartmentSummary();
    saveEmployees(); // Save updated employee data to localStorage
}

// Add employee from form
document.getElementById('employee-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const newEmployee = {
        empId: document.getElementById('emp-id').value,
        name: document.getElementById('name').value,
        department: document.getElementById('department').value,
        salary: parseFloat(document.getElementById('salary').value),
        performance: document.getElementById('performance').value, 
       
    };

    // Push the new employee to the array and update the display
    employees.push(newEmployee);
    displayEmployees();
    this.reset(); // Reset the form fields
});

// Remove employee
function removeEmployee(empId) {
    employees = employees.filter(emp => emp.empId !== empId);
    displayEmployees();
}

// Promote employee (Increase salary)
function promoteEmployee(empId) {
    const emp = employees.find(emp => emp.empId === empId);
    const newSalary = parseFloat(prompt('Enter new salary for ' + emp.name, emp.salary));
    
    if (!isNaN(newSalary) && newSalary > emp.salary) { // Only allow a raise in salary
        emp.salary = newSalary;
        saveEmployees(); // Save the updated salary to localStorage
        displayEmployees();
        alert(emp.name + ' has been promoted. New salary: ₹' + emp.salary);
    } else {
        alert('Invalid or lower salary entered. No changes made.');
    }
}

// Search employees
function searchEmployees() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const filteredEmployees = employees.filter(emp =>
        emp.empId.includes(searchValue) || emp.name.toLowerCase().includes(searchValue) || emp.department.toLowerCase().includes(searchValue)
    );
    const tbody = document.getElementById('employee-table-body');
    tbody.innerHTML = filteredEmployees.map(emp => `
        <tr>
            <td>${emp.empId}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.salary}</td>
            <td>${emp.performance}</td>
            <td>
                <button class="btn" onclick="removeEmployee('${emp.empId}')">Remove</button>
                <button class="btn" onclick="promoteEmployee('${emp.empId}')">Promote</button>
            </td>
        </tr>
    `).join('');
}

// Calculate department summary
function calculateDepartmentSummary() {
    const summary = {};
    employees.forEach(emp => {
        summary[emp.department] = summary[emp.department] || { count: 0, totalSalary: 0 };
        summary[emp.department].count++;
        summary[emp.department].totalSalary += emp.salary;
    });
    const report = document.getElementById('summary-report');
    report.innerHTML = Object.entries(summary).map(([dept, data]) => `
        <p><strong>${dept}:</strong> ${data.count} Employees, Total Salary: ₹${data.totalSalary.toFixed(2)}</p>
    `).join('');
}

// Initial display
displayEmployees();
