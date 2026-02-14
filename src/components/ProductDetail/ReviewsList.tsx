"use client";

import React, { useState } from "react";
import { useGetProductReviewsQuery } from "@/redux/services/productsApi";
import type { Review } from "@/redux/services/productsApi";

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`${filled ? "fill-[#FFA645]" : "fill-gray-3"}`}
    width="16"
    height="16"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z" />
  </svg>
);

const ReviewItem = ({ review }: { review: Review }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="border-b border-gray-3 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-dark mb-1">{review.author}</h4>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} filled={i <= review.rating} />
            ))}
          </div>
        </div>
        <span className="text-sm text-dark-4">{formatDate(review.createdAt)}</span>
      </div>
      
      {review.title && (
        <h5 className="font-medium text-dark mb-2">{review.title}</h5>
      )}
      
      <p className="text-dark-2 leading-relaxed">{review.comment}</p>
    </div>
  );
};

interface ReviewsListProps {
  slug: string;
}

export default function ReviewsList({ slug }: ReviewsListProps) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useGetProductReviewsQuery({
    slug,
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
        <p className="mt-3 text-dark-2">Loading reviews...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red">
        <p>Failed to load reviews. Please try again later.</p>
        {error && "message" in error && (
          <p className="text-sm mt-2">{String((error as any).message)}</p>
        )}
      </div>
    );
  }

  if (!data || data.reviews.length === 0) {
    return (
      <div className="py-10 text-center">
        <svg
          className="mx-auto mb-4 text-gray-4"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M12 6C11.45 6 11 6.45 11 7V13C11 13.55 11.45 14 12 14C12.55 14 13 13.55 13 13V7C13 6.45 12.55 6 12 6ZM12 16C11.45 16 11 16.45 11 17C11 17.55 11.45 18 12 18C12.55 18 13 17.55 13 17C13 16.45 12.55 16 12 16Z"
            fill="currentColor"
          />
        </svg>
        <p className="text-dark-2 mb-2">No reviews yet</p>
        <p className="text-sm text-dark-4">Be the first to review this product!</p>
      </div>
    );
  }

  const { meta, reviews } = data;
  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div>
      {/* Reviews Summary */}
      <div className="mb-3 pb-6 border-b border-gray-3">
        <p className="text-dark-2">
          Showing {reviews.length} of {meta.total} review{meta.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-3 text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-2 ease-out duration-200"
            aria-label="Previous page"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.7071 4.29289C13.0976 4.68342 13.0976 5.31658 12.7071 5.70711L8.41421 10L12.7071 14.2929C13.0976 14.6834 13.0976 15.3166 12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L6.29289 10.7071C5.90237 10.3166 5.90237 9.68342 6.29289 9.29289L11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289Z"
                fill=""
              />
            </svg>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`flex items-center justify-center w-10 h-10 rounded-md border ease-out duration-200 ${
                    page === pageNum
                      ? "border-blue bg-blue text-white"
                      : "border-gray-3 text-dark hover:bg-gray-2"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-3 text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-2 ease-out duration-200"
            aria-label="Next page"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.29289 4.29289C7.68342 3.90237 8.31658 3.90237 8.70711 4.29289L13.7071 9.29289C14.0976 9.68342 14.0976 10.3166 13.7071 10.7071L8.70711 15.7071C8.31658 16.0976 7.68342 16.0976 7.29289 15.7071C6.90237 15.3166 6.90237 14.6834 7.29289 14.2929L11.5858 10L7.29289 5.70711C6.90237 5.31658 6.90237 4.68342 7.29289 4.29289Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
