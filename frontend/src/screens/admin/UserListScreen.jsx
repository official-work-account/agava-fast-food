import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { useParams, useLocation } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import Paginate from "../../components/Paginate";

const UserListScreen = () => {
  const url = useLocation();
  const { pageNumber } = useParams();

  const { data, refetch, isLoading, error } = useGetUsersQuery({ pageNumber });

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete user?")) {
      try {
        const res = await deleteUser(id).unwrap();
        // console.log(res);
        toast.success(res.message);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
    // console.log(id);
  };

  return (
    <>
      <h1>User List</h1>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>CREATED ON</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>{user.createdAt.substring(0, 10)}</td>

                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="secondary" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          Page
          <Paginate
            pages={data.pages}
            page={data.page}
            url={url}
            isAdmin={true}
          />
        </>
      )}
    </>
  );
};

export default UserListScreen;
