import Link from "next/link";
import React from "react";

const Breadcrumb = ({ title, pages }) => {
  // Debug: kiểm tra type của title
  console.log('Breadcrumb title type:', typeof title, title);
  
  // Đảm bảo title là string
  const safeTitle = typeof title === 'object' && title !== null 
    ? JSON.stringify(title) 
    : String(title || 'Page');
  
  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[165px]">
      <div className="border-t border-gray-3">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2">
              {safeTitle}
            </h1>

            <ul className="flex items-center gap-2">
              <li className="text-custom-sm hover:text-blue">
                <Link href="/">Home /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => {
                  // Đảm bảo page là string, không phải object
                  const safePage = typeof page === 'string' ? page : (page?.name || String(page));
                  console.log('Breadcrumb page:', typeof page, page);
                  return (
                    <li className="text-custom-sm last:text-blue capitalize" key={key}>
                      {safePage} 
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
