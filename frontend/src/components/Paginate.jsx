import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// const Paginate = ({ pages, page, url, isAdmin = false, keyword = "" }) => {
//   // console.log(url);
//   return (
//     pages > 1 && (
//       <Pagination>
//         {[...Array(pages).keys()].map((x) => (
//           <LinkContainer
//             key={x + 1}
//             to={
//               !isAdmin
//                 ? keyword
//                   ? `/search/${keyword}/page/${x + 1}`
//                   : `/page/${x + 1}`
//                 : `/admin/productlist/${x + 1}`
//             }
//           >
//             <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
//           </LinkContainer>
//         ))}
//       </Pagination>
//     )
//   );
// };

const Paginate = ({ pages, page, url, isAdmin = false, keyword = "" }) => {
  const pathname = url.pathname;

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : pathname.includes("/profile")
                  ? `/profile/${x + 1}`
                  : `/page/${x + 1}`
                : pathname.includes("admin/orderlist")
                ? `/admin/orderlist/${x + 1}`
                : pathname.includes("admin/userlist")
                ? `/admin/userlist/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
