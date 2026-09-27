import {useEffect, useState} from "react";
import {Table, Layout, Button} from "antd";
import {useNavigate} from "react-router-dom";
import api from "../api/axios";
import type {DepartmentReport} from "../types";

const Report = () => {
  const [data, setData] = useState<DepartmentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get<DepartmentReport[]>("/employees/report/summary")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {title: "Department", dataIndex: "department"},
    {title: "Employee Count", dataIndex: "employeeCount"},
    {title: "Total Salary", dataIndex: "totalSalary"},
    {title: "Average Salary", dataIndex: "averageSalary"},
  ];

  return (
    <Layout style={{padding: 24}}>
      <Button
        onClick={() => navigate("/employees")}
        style={{marginBottom: 16, width: 150}}
      >
        Back to Employees
      </Button>
      <Table
        rowKey="department"
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </Layout>
  );
};

export default Report;
