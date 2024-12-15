import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "GET", // Note: default method is "GET". So "method" can be ommitted if request is a "GET" request.
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: { ...details },
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    // New code
    initiateTrans: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/initiateTransaction`,
        method: "POST",
      }),
    }),
    getAccessCode: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/getcode`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: ({ pageNumber }) => ({
        url: `${ORDERS_URL}/myorders`,
        params: { pageNumber },
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: ({ pageNumber }) => ({
        url: ORDERS_URL,
        params: { pageNumber },
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useGetAccessCodeQuery,
  useInitiateTransMutation,
} = ordersApiSlice;
