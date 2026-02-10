const data = [
  {
    title: "Living Room",
    id: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBLONY7ntrsmoVV6DTJm3hFPqI5H9nqmr3O7Gs9u2TjM5eCeccpqaWEsqCbDlThJSlhqefmku6XUxdsigjJ2UZO2oZPM6WCRSHPJQZMmHJTMyqt95eNkI1w66N3rJrWwgqz-6_pp-LcBAFR3_W9b2bfpBZw-tSZz8kTAqvvxf1mtyn9zBxYZf3RT3YS9Z6z-35ad_9DT4PH9SfmKpoBALckSiBClppBCRdlHN1LCdI5ChmBk2CijzuMM5NVtky-n-6vMX4sG4HdQ",
  },
  {
    title: "Dining Tables",
    id: 2,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoPJJHLYaN3eOgEeXWxor9LVZR9caosxCL3cXOrKbShlOCnYzjE5P04d0PISfuy_0ahpc93sCd9j6Js71Gbe6g9nYpa-nOrRVpBkLnu3HYA9QIutbVTqO4a0lY98Y05gPZY5KKCgFRcV0RJ1yGf0y5BmKk8aCS3JQr_oMQFGrZm6v-LVfB900adTvWFqDzkVvRy37f-Nom2MCu7YGv1D5rBceOpvwYIQP0UcvCK6V4nmFYYsQrmwZ4adWRhw-QShKXYv2Tv2d46w",
  },
  {
    title: "Office Chair",
    id: 3,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfTdyhnI3c84yyukUajea1bSi72GuxW5y0pQ7DIUYfaxqmaZHgptfZHievyT3NyhSaCDLr1rIY9Mg6jGTNMrGj-R4bXDV6RNb7cFPM2X5rF8WhXf1VDzexLZotjnJijj9mWKiuw0EjQgiMzUIFUFK-7wxgqD0waQZvm7AvjCRnQCDGBGSO-glzVSL8U-7xY_PmRbe5dDp3nrnZvmT0khApB_Shf22R0p69c4tfpk1ooUaJ5fedkQE0xFqUU0boupaXxgbUBHnsUg",
  },
  {
    title: "Decorative Lights",
    id: 4,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDo3r87ShHo-4unf28gEtNiC4osQmqHCLkF5qExsW9lXxQWh9PTsILrrNn7LVACdJTYB_3sLQ0JzmdjAx1QSdl9mki4BdiJvn5E0JWrWsPWnONXWTAOF7K5-tFxgt91TPC0c8MF8n8cUiqDmJJ3gNplFEHGSepP4T5g8-hR1GcxjlV3AmJRrOmfvpMnzFCMAgOtbjPysGU8GwwWGMQDN7Rj7t0qN4b7nU_-JQtcu1ivT6oogLvhy5qOvoZc7HuhII0S_09ekp_16w",
  },
  {
    title: "Bedroom",
    id: 5,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGxTf0FEvB30LBZ6boAiqp2Ngfl0-yaG-aVbWoKlHORKtGgp7u7XhBFeP3Qcilf8-LUQ9brypdbHvxw0sWbcM6YFiVGL0M5z7z1iuwso0rfNmNU0zSXQujCxDkOwOJm4YrCCn1oWYxbAJaV7HTn3V62f1b-ithnztUqku63NvixfdFH22a_IrXW7Pt395_1pnz1zEHcP9NfZEJdPzFyCb9khpmKIibcDB8p-t5dlYy1xslelOSVSRnZ2JodoBXV7EFdmGRFc0Tkg",
  },
  {
    title: "Outdoor",
    id: 6,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0IJNLzBS0YFp-EVxX5vm-enh34sTdkOB584bb0pIqUjTcdUnVqUVLOnaV1cRlwV1_E5sgmnpBEmoZ0QwwqJsXVOthYTz3ph1koVvzuQstR_CM3vbD-85_B2VFlTRdkTyTEwsPl4igPwx25cn2DMFzvCjpFpt8Ai95Jr0WvZhP7OjEJqn1lhhIXw_V9LTII8RFZGdPDf73bZ0l-NzT8OgpCtYDJSOnz5AGxNVonpltbFxZz8XtMghADjInqIpoGS9EcwnlcxIiSQ",
  },
  {
    title: "Bedroom",
    id: 7,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfTdyhnI3c84yyukUajea1bSi72GuxW5y0pQ7DIUYfaxqmaZHgptfZHievyT3NyhSaCDLr1rIY9Mg6jGTNMrGj-R4bXDV6RNb7cFPM2X5rF8WhXf1VDzexLZotjnJijj9mWKiuw0EjQgiMzUIFUFK-7wxgqD0waQZvm7AvjCRnQCDGBGSO-glzVSL8U-7xY_PmRbe5dDp3nrnZvmT0khApB_Shf22R0p69c4tfpk1ooUaJ5fedkQE0xFqUU0boupaXxgbUBHnsUg",
  },
  {
    title: "Decorative Lights",
    id: 8,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDo3r87ShHo-4unf28gEtNiC4osQmqHCLkF5qExsW9lXxQWh9PTsILrrNn7LVACdJTYB_3sLQ0JzmdjAx1QSdl9mki4BdiJvn5E0JWrWsPWnONXWTAOF7K5-tFxgt91TPC0c8MF8n8cUiqDmJJ3gNplFEHGSepP4T5g8-hR1GcxjlV3AmJRrOmfvpMnzFCMAgOtbjPysGU8GwwWGMQDN7Rj7t0qN4b7nU_-JQtcu1ivT6oogLvhy5qOvoZc7HuhII0S_09ekp_16w",
  },
];

export default data;
