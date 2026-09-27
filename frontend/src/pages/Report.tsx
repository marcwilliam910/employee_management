import {useEffect, useState} from "react";
import {Table, Layout, Button, Alert, Typography, Space} from "antd";
import {useNavigate} from "react-router-dom";
import api from "../api/axios";
import type {DepartmentReport} from "../types";

const formatMoney = (value: number) =>
  Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Report = () => {
  const [data, setData] = useState<DepartmentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<DepartmentReport[]>("/employees/report/summary");
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    {title: "Department", dataIndex: "department"},
    {title: "Employee Count", dataIndex: "employeeCount"},
    {
      title: "Total Salary",
      dataIndex: "totalSalary",
      render: (v: number) => formatMoney(v),
    },
    {
      title: "Average Salary",
      dataIndex: "averageSalary",
      render: (v: number) => formatMoney(v),
    },
  ];

  return (
    <Layout style={{minHeight: "100vh", padding: 24, background: "#f5f5f5"}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography.Title level={3} style={{margin: 0}}>
          Department Report
        </Typography.Title>
        <Space>
          <Button onClick={load} loading={loading}>
            Refresh
          </Button>
          <Button onClick={() => navigate("/employees")}>
            Back to Employees
          </Button>
        </Space>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          action={
            <Button size="small" onClick={load} loading={loading}>
              Retry
            </Button>
          }
          style={{marginBottom: 16}}
        />
      )}

      <Table
        rowKey="department"
        columns={columns}
        dataSource={data}
        loading={loading}
        locale={{emptyText: error ? " " : "No department data yet"}}
      />
    </Layout>
  );
};

export default Report;
