import {useEffect, useState} from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  message,
  Popconfirm,
  Layout,
  Alert,
  Typography,
  Space,
} from "antd";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import api from "../api/axios";
import {useAuth} from "../context/AuthContext";
import type {Employee, EmployeeInput} from "../types";

const formatSalary = (value: number) =>
  Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form] = Form.useForm();
  const {logout} = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Employee[]>("/employees");
      setEmployees(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load employees";
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    form.setFieldsValue({
      ...employee,
      dateHired: dayjs(employee.dateHired),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/employees/${id}`);
      message.success("Employee deleted");
      await load();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to delete employee");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: EmployeeInput = {
        ...values,
        dateHired: values.dateHired.format("YYYY-MM-DD"),
      };

      setSaving(true);
      if (editing) {
        await api.put(`/employees/${editing.id}`, payload);
        message.success("Employee updated");
      } else {
        await api.post("/employees", payload);
        message.success("Employee created");
      }
      setModalOpen(false);
      await load();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {title: "Name", dataIndex: "name"},
    {title: "Email", dataIndex: "email"},
    {title: "Position", dataIndex: "position"},
    {title: "Department", dataIndex: "department"},
    {
      title: "Salary",
      dataIndex: "salary",
      render: (v: number) => formatSalary(v),
    },
    {
      title: "Date Hired",
      dataIndex: "dateHired",
      render: (v: string) => dayjs(v).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      render: (_: any, record: Employee) => (
        <Space>
          <Button
            size="small"
            onClick={() => openEdit(record)}
            disabled={deletingId === record.id}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this employee?"
            onConfirm={() => handleDelete(record.id)}
            disabled={deletingId === record.id}
          >
            <Button
              size="small"
              danger
              loading={deletingId === record.id}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
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
          Employees
        </Typography.Title>
        <Space>
          <Button type="primary" onClick={openCreate}>
            Add Employee
          </Button>
          <Button onClick={() => navigate("/report")}>View Report</Button>
          <Button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
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
        rowKey="id"
        columns={columns}
        dataSource={employees}
        loading={loading}
        locale={{emptyText: error ? " " : "No employees yet"}}
      />

      <Modal
        title={editing ? "Edit Employee" : "Add Employee"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okButtonProps={{disabled: saving}}
        cancelButtonProps={{disabled: saving}}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" disabled={saving}>
          <Form.Item name="name" label="Name" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{required: true, type: "email"}]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="position"
            label="Position"
            rules={[{required: true}]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            rules={[{required: true}]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="salary" label="Salary" rules={[{required: true}]}>
            <InputNumber style={{width: "100%"}} min={0} />
          </Form.Item>
          <Form.Item
            name="dateHired"
            label="Date Hired"
            rules={[{required: true}]}
          >
            <DatePicker style={{width: "100%"}} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Employees;
