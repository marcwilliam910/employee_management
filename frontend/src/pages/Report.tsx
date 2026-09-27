import {useEffect, useState} from "react";
import {Table, Layout, Button, Alert, Typography, Space, message} from "antd";
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
  const [downloading, setDownloading] = useState(false);
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

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await api.get("/employees/report/pdf", {
        responseType: "blob",
      });

      if (res.data.type === "application/json") {
        const text = await res.data.text();
        const body = JSON.parse(text);
        throw new Error(body.message || "Failed to download PDF");
      }

      const blob = new Blob([res.data], {type: "application/pdf"});
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `department-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success("PDF downloaded");
    } catch (err: any) {
      if (err.response?.data instanceof Blob) {
        try {
          const body = JSON.parse(await err.response.data.text());
          message.error(body.message || "Failed to download PDF");
        } catch {
          message.error("Failed to download PDF");
        }
      } else {
        message.error(err.message || "Failed to download PDF");
      }
    } finally {
      setDownloading(false);
    }
  };

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
          <Button type="primary" onClick={downloadPdf} loading={downloading}>
            Download PDF
          </Button>
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
