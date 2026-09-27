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
} from "antd";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import api from "../api/axios";
import {useAuth} from "../context/AuthContext";
import type {Employee, EmployeeInput} from "../types";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form] = Form.useForm();
  const {logout} = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<Employee[]>("/employees");
      setEmployees(res.data);
    } catch (err) {
      message.error("Failed to load employees");
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
    try {
      await api.delete(`/employees/${id}`);
      message.success("Employee deleted");
      load();
    } catch (err) {
      message.error("Failed to delete employee");
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: EmployeeInput = {
      ...values,
      dateHired: values.dateHired.format("YYYY-MM-DD"),
    };

    try {
      if (editing) {
        await api.put(`/employees/${editing.id}`, payload);
        message.success("Employee updated");
      } else {
        await api.post("/employees", payload);
        message.success("Employee created");
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Save failed");
    }
  };

  const columns = [
    {title: "Name", dataIndex: "name"},
    {title: "Email", dataIndex: "email"},
    {title: "Position", dataIndex: "position"},
    {title: "Department", dataIndex: "department"},
    {title: "Salary", dataIndex: "salary"},
    {
      title: "Date Hired",
      dataIndex: "dateHired",
      render: (v: string) => dayjs(v).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      render: (_: any, record: Employee) => (
        <>
          <Button
            size="small"
            onClick={() => openEdit(record)}
            style={{marginRight: 8}}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this employee?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Layout style={{padding: 24}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <Button type="primary" onClick={openCreate} style={{marginRight: 8}}>
            Add Employee
          </Button>
          <Button onClick={() => navigate("/report")}>View Report</Button>
        </div>
        <Button onClick={logout}>Logout</Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={employees}
        loading={loading}
      />

      <Modal
        title={editing ? "Edit Employee" : "Add Employee"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical">
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
