import React from "react";
import SingleOrder from "./SingleOrder";
import { useGetOrdersQuery } from "@/redux/services/ordersApi";

const Orders = () => {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();
  const error = isError ? "Failed to load orders" : null;

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[770px]">
          {/* <!-- order item --> */}
          {orders.length > 0 && (
            <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
              <div className="min-w-[111px]">
                <p className="text-custom-sm text-dark">Order</p>
              </div>
              <div className="min-w-[175px]">
                <p className="text-custom-sm text-dark">Date</p>
              </div>

              <div className="min-w-[128px]">
                <p className="text-custom-sm text-dark">Status</p>
              </div>

              <div className="min-w-[213px]">
                <p className="text-custom-sm text-dark">Title</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">Total</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">Action</p>
              </div>
            </div>
          )}
          {isLoading && (
            <p className="py-9.5 px-4 sm:px-7.5 xl:px-10">Loading orders...</p>
          )}
          {!isLoading && error && (
            <p className="py-9.5 px-4 sm:px-7.5 xl:px-10 text-red">
              {error}
            </p>
          )}
          {!isLoading && !error && orders.length === 0 && (
            <p className="py-9.5 px-4 sm:px-7.5 xl:px-10">
              You don&apos;t have any orders!
            </p>
          )}
          {!isLoading &&
            !error &&
            orders.length > 0 &&
            orders.map((orderItem, key) => (
              <SingleOrder key={key} orderItem={orderItem} smallView={false} />
            ))}
        </div>

        {!isLoading &&
          !error &&
          orders.length > 0 &&
          orders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} />
          ))}
      </div>
    </>
  );
};

export default Orders;
