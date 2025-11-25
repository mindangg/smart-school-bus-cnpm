const routesData = [
    // === TUYẾN 1 – MORNING ===
    {
        route: {route_id: 1, route_type: "MORNING", start_time: "06:00", generated_from: null},
        stops: [
            {stop_id: 28, stop_order: 1},
            {stop_id: 12, stop_order: 2},
            {stop_id: 15, stop_order: 3},
            {stop_id: 13, stop_order: 4},
            {stop_id: 14, stop_order: 5},
            {stop_id: 7, stop_order: 6},
            {stop_id: 1, stop_order: 7},
        ],
    },
    // === TUYẾN 1 – AFTERNOON ===
    {
        route: {route_id: 2, route_type: "AFTERNOON", start_time: "17:00", generated_from: 1},
        stops: [
            {stop_id: 1, stop_order: 1},
            {stop_id: 7, stop_order: 2},
            {stop_id: 14, stop_order: 3},
            {stop_id: 13, stop_order: 4},
            {stop_id: 15, stop_order: 5},
            {stop_id: 12, stop_order: 6},
            {stop_id: 28, stop_order: 7},
        ],
    },

    // === TUYẾN 2 – MORNING ===
    {
        route: {route_id: 3, route_type: "MORNING", start_time: "06:10", generated_from: null},
        stops: [
            {stop_id: 29, stop_order: 1},
            {stop_id: 17, stop_order: 2},
            {stop_id: 16, stop_order: 3},
            {stop_id: 19, stop_order: 4},
            {stop_id: 21, stop_order: 5},
            {stop_id: 3, stop_order: 6},
            {stop_id: 2, stop_order: 7},
        ],
    },
    // === TUYẾN 2 – AFTERNOON ===
    {
        route: {route_id: 4, route_type: "AFTERNOON", start_time: "17:10", generated_from: 3},
        stops: [
            {stop_id: 2, stop_order: 1},
            {stop_id: 3, stop_order: 2},
            {stop_id: 21, stop_order: 3},
            {stop_id: 19, stop_order: 4},
            {stop_id: 16, stop_order: 5},
            {stop_id: 17, stop_order: 6},
            {stop_id: 29, stop_order: 7},
        ],
    },

    // === TUYẾN 3 – MORNING ===
    {
        route: {route_id: 5, route_type: "MORNING", start_time: "06:15", generated_from: null},
        stops: [
            {stop_id: 25, stop_order: 1},
            {stop_id: 24, stop_order: 2},
            {stop_id: 23, stop_order: 3},
            {stop_id: 22, stop_order: 4},
            {stop_id: 26, stop_order: 5},
            {stop_id: 27, stop_order: 6},
            {stop_id: 3, stop_order: 7},
        ],
    },
    // === TUYẾN 3 – AFTERNOON ===
    {
        route: {route_id: 6, route_type: "AFTERNOON", start_time: "17:15", generated_from: 5},
        stops: [
            {stop_id: 3, stop_order: 1},
            {stop_id: 27, stop_order: 2},
            {stop_id: 26, stop_order: 3},
            {stop_id: 22, stop_order: 4},
            {stop_id: 23, stop_order: 5},
            {stop_id: 24, stop_order: 6},
            {stop_id: 25, stop_order: 7},
        ],
    },

    // === TUYẾN 4 – MORNING ===
    {
        route: {route_id: 7, route_type: "MORNING", start_time: "06:20", generated_from: null},
        stops: [
            {stop_id: 30, stop_order: 1},
            {stop_id: 8, stop_order: 2},
            {stop_id: 9, stop_order: 3},
            {stop_id: 10, stop_order: 4},
            {stop_id: 11, stop_order: 5},
            {stop_id: 19, stop_order: 6},
            {stop_id: 4, stop_order: 7},
        ],
    },
    // === TUYẾN 4 – AFTERNOON ===
    {
        route: {route_id: 8, route_type: "AFTERNOON", start_time: "17:20", generated_from: 7},
        stops: [
            {stop_id: 4, stop_order: 1},
            {stop_id: 19, stop_order: 2},
            {stop_id: 11, stop_order: 3},
            {stop_id: 10, stop_order: 4},
            {stop_id: 9, stop_order: 5},
            {stop_id: 8, stop_order: 6},
            {stop_id: 30, stop_order: 7},
        ],
    },

    // === TUYẾN 5 – MORNING ===
    {
        route: {route_id: 9, route_type: "MORNING", start_time: "06:30", generated_from: null},
        stops: [
            {stop_id: 21, stop_order: 1},
            {stop_id: 24, stop_order: 2},
            {stop_id: 25, stop_order: 3},
            {stop_id: 23, stop_order: 4},
            {stop_id: 26, stop_order: 5},
            {stop_id: 27, stop_order: 6},
            {stop_id: 5, stop_order: 7},
        ],
    },
    // === TUYẾN 5 – AFTERNOON ===
    {
        route: {route_id: 10, route_type: "AFTERNOON", start_time: "17:30", generated_from: 9},
        stops: [
            {stop_id: 5, stop_order: 1},
            {stop_id: 27, stop_order: 2},
            {stop_id: 26, stop_order: 3},
            {stop_id: 23, stop_order: 4},
            {stop_id: 25, stop_order: 5},
            {stop_id: 24, stop_order: 6},
            {stop_id: 21, stop_order: 7},
        ],
    },

    // === TUYẾN 6 – MORNING ===
    {
        route: {route_id: 11, route_type: "MORNING", start_time: "06:40", generated_from: null},
        stops: [
            {stop_id: 29, stop_order: 1},
            {stop_id: 12, stop_order: 2},
            {stop_id: 15, stop_order: 3},
            {stop_id: 13, stop_order: 4},
            {stop_id: 14, stop_order: 5},
            {stop_id: 7, stop_order: 6},
            {stop_id: 6, stop_order: 7},
        ],
    },
    // === TUYẾN 6 – AFTERNOON ===
    {
        route: {route_id: 12, route_type: "AFTERNOON", start_time: "17:40", generated_from: 11},
        stops: [
            {stop_id: 6, stop_order: 1},
            {stop_id: 7, stop_order: 2},
            {stop_id: 14, stop_order: 3},
            {stop_id: 13, stop_order: 4},
            {stop_id: 15, stop_order: 5},
            {stop_id: 12, stop_order: 6},
            {stop_id: 29, stop_order: 7},
        ],
    },

    // === TUYẾN 7 – MORNING ===
    {
        route: {route_id: 13, route_type: "MORNING", start_time: "06:50", generated_from: null},
        stops: [
            {stop_id: 28, stop_order: 1},
            {stop_id: 30, stop_order: 2},
            {stop_id: 8, stop_order: 3},
            {stop_id: 11, stop_order: 4},
            {stop_id: 19, stop_order: 5},
            {stop_id: 14, stop_order: 6},
            {stop_id: 7, stop_order: 7},
        ],
    },
    // === TUYẾN 7 – AFTERNOON ===
    {
        route: {route_id: 14, route_type: "AFTERNOON", start_time: "17:50", generated_from: 13},
        stops: [
            {stop_id: 7, stop_order: 1},
            {stop_id: 14, stop_order: 2},
            {stop_id: 19, stop_order: 3},
            {stop_id: 11, stop_order: 4},
            {stop_id: 8, stop_order: 5},
            {stop_id: 30, stop_order: 6},
            {stop_id: 28, stop_order: 7},
        ],
    },
    // ==================== 18 TUYẾN MỚI (8 → 25) – HOÀN TOÀN MỚI ====================

    // TUYẾN 8 – HÓC MÔN → GÒ VẤP → ĐH SÀI GÒN CƠ SỞ 2 (CHỈ 23KM – HOÀN HẢO)
    {
        route: { route_id: 15, route_type: "MORNING", start_time: "06:20", generated_from: null },
        stops: [
            { stop_id: 31, stop_order: 1 },
            { stop_id: 32, stop_order: 2 },
            { stop_id: 35, stop_order: 3 },
            { stop_id: 34, stop_order: 4 },
            { stop_id: 17, stop_order: 5 },
            { stop_id: 3,  stop_order: 6 },
        ],
    },
    {
        route: { route_id: 16, route_type: "AFTERNOON", start_time: "17:20", generated_from: 15 },
        stops: [
            { stop_id: 3,  stop_order: 1 },
            { stop_id: 17, stop_order: 2 },
            { stop_id: 34, stop_order: 3 },
            { stop_id: 35, stop_order: 4 },
            { stop_id: 32, stop_order: 5 },
            { stop_id: 31, stop_order: 6 },
        ],
    },

    // === TUYẾN 9 – CỦ CHI → QUỐC LỘ 22 → ĐH FPT ===
    {
        route: {route_id: 17, route_type: "MORNING", start_time: "05:45", generated_from: null},
        stops: [
            {stop_id: 36, stop_order: 1},
            {stop_id: 39, stop_order: 2},
            {stop_id: 40, stop_order: 3},
            {stop_id: 35, stop_order: 4},
            {stop_id: 34, stop_order: 5},
            {stop_id: 27, stop_order: 6},
            {stop_id: 5, stop_order: 7},
        ],
    },
    {
        route: {route_id: 18, route_type: "AFTERNOON", start_time: "17:45", generated_from: 17},
        stops: [
            {stop_id: 5, stop_order: 1},
            {stop_id: 27, stop_order: 2},
            {stop_id: 34, stop_order: 3},
            {stop_id: 35, stop_order: 4},
            {stop_id: 40, stop_order: 5},
            {stop_id: 39, stop_order: 6},
            {stop_id: 36, stop_order: 7},
        ],
    },

    // === TUYẾN 10 – NHÀ BÈ → Q7 → RMIT ===
    {
        route: {route_id: 19, route_type: "MORNING", start_time: "06:25", generated_from: null},
        stops: [
            {stop_id: 29, stop_order: 1},
            {stop_id: 30, stop_order: 2},
            {stop_id: 8, stop_order: 3},
            {stop_id: 9, stop_order: 4},
            {stop_id: 10, stop_order: 5},
            {stop_id: 11, stop_order: 6},
            {stop_id: 4, stop_order: 7},
        ],
    },
    {
        route: {route_id: 20, route_type: "AFTERNOON", start_time: "17:25", generated_from: 19},
        stops: [
            {stop_id: 4, stop_order: 1},
            {stop_id: 11, stop_order: 2},
            {stop_id: 10, stop_order: 3},
            {stop_id: 9, stop_order: 4},
            {stop_id: 8, stop_order: 5},
            {stop_id: 30, stop_order: 6},
            {stop_id: 29, stop_order: 7},
        ],
    },

    // === TUYẾN 11 – BÌNH THẠNH → PHÚ NHUẬN → ĐH SÀI GÒN CS1 ===
    {
        route: {route_id: 21, route_type: "MORNING", start_time: "06:30", generated_from: null},
        stops: [
            {stop_id: 23, stop_order: 1},
            {stop_id: 24, stop_order: 2},
            {stop_id: 25, stop_order: 3},
            {stop_id: 21, stop_order: 4},
            {stop_id: 19, stop_order: 5},
            {stop_id: 16, stop_order: 6},
            {stop_id: 2, stop_order: 7},
        ],
    },
    {
        route: {route_id: 22, route_type: "AFTERNOON", start_time: "17:30", generated_from: 21},
        stops: [
            {stop_id: 2, stop_order: 1},
            {stop_id: 16, stop_order: 2},
            {stop_id: 19, stop_order: 3},
            {stop_id: 21, stop_order: 4},
            {stop_id: 25, stop_order: 5},
            {stop_id: 24, stop_order: 6},
            {stop_id: 23, stop_order: 7},
        ],
    },

    // === TUYẾN 12 – QUẬN 1-3 → ĐH BÁCH KHOA ===
    {
        route: {route_id: 23, route_type: "MORNING", start_time: "06:35", generated_from: null},
        stops: [
            {stop_id: 18, stop_order: 1},
            {stop_id: 20, stop_order: 2},
            {stop_id: 21, stop_order: 3},
            {stop_id: 19, stop_order: 4},
            {stop_id: 14, stop_order: 5},
            {stop_id: 7, stop_order: 6},
            {stop_id: 6, stop_order: 7},
        ],
    },
    {
        route: {route_id: 24, route_type: "AFTERNOON", start_time: "17:35", generated_from: 23},
        stops: [
            {stop_id: 6, stop_order: 1},
            {stop_id: 7, stop_order: 2},
            {stop_id: 14, stop_order: 3},
            {stop_id: 19, stop_order: 4},
            {stop_id: 21, stop_order: 5},
            {stop_id: 20, stop_order: 6},
            {stop_id: 18, stop_order: 7},
        ],
    },

    // === TUYẾN 13 – TÂN BÌNH → TÂN PHÚ → ĐH BÁCH KHOA ===
    {
        route: {route_id: 25, route_type: "MORNING", start_time: "06:40", generated_from: null},
        stops: [
            {stop_id: 17, stop_order: 1},
            {stop_id: 16, stop_order: 2},
            {stop_id: 19, stop_order: 3},
            {stop_id: 14, stop_order: 4},
            {stop_id: 7, stop_order: 5},
            {stop_id: 6, stop_order: 6},
        ],
    },
    {
        route: {route_id: 26, route_type: "AFTERNOON", start_time: "17:40", generated_from: 25},
        stops: [
            {stop_id: 6, stop_order: 1},
            {stop_id: 7, stop_order: 2},
            {stop_id: 14, stop_order: 3},
            {stop_id: 19, stop_order: 4},
            {stop_id: 16, stop_order: 5},
            {stop_id: 17, stop_order: 6},
        ],
    },

    // === TUYẾN 14 – Q.8 → Q.6 → Q.5 → ĐH SÀI GÒN CHÍNH ===
    {
        route: {route_id: 27, route_type: "MORNING", start_time: "06:12", generated_from: null},
        stops: [
            {stop_id: 12, stop_order: 1},
            {stop_id: 15, stop_order: 2},
            {stop_id: 13, stop_order: 3},
            {stop_id: 14, stop_order: 4},
            {stop_id: 7, stop_order: 5},
            {stop_id: 1, stop_order: 6},
        ],
    },
    {
        route: {route_id: 28, route_type: "AFTERNOON", start_time: "17:12", generated_from: 27},
        stops: [
            {stop_id: 1, stop_order: 1},
            {stop_id: 7, stop_order: 2},
            {stop_id: 14, stop_order: 3},
            {stop_id: 13, stop_order: 4},
            {stop_id: 15, stop_order: 5},
            {stop_id: 12, stop_order: 6},
        ],
    },

    // === TUYẾN 15 – THỦ ĐỨC → HUTECH → ĐH FPT ===
    {
        route: {route_id: 29, route_type: "MORNING", start_time: "06:18", generated_from: null},
        stops: [
            {stop_id: 22, stop_order: 1},
            {stop_id: 23, stop_order: 2},
            {stop_id: 24, stop_order: 3},
            {stop_id: 25, stop_order: 4},
            {stop_id: 26, stop_order: 5},
            {stop_id: 5, stop_order: 6},
        ],
    },
    {
        route: {route_id: 30, route_type: "AFTERNOON", start_time: "17:18", generated_from: 29},
        stops: [
            {stop_id: 5, stop_order: 1},
            {stop_id: 26, stop_order: 2},
            {stop_id: 25, stop_order: 3},
            {stop_id: 24, stop_order: 4},
            {stop_id: 23, stop_order: 5},
            {stop_id: 22, stop_order: 6},
        ],
    },

    // === TUYẾN 16 – QUẬN 9 → KHU CNC → ĐH FPT ===
    {
        route: {route_id: 31, route_type: "MORNING", start_time: "06:22", generated_from: null},
        stops: [
            {stop_id: 40, stop_order: 1},
            {stop_id: 34, stop_order: 2},
            {stop_id: 17, stop_order: 3},
            {stop_id: 26, stop_order: 4},
            {stop_id: 27, stop_order: 5},
            {stop_id: 5, stop_order: 6},
        ],
    },
    {
        route: {route_id: 32, route_type: "AFTERNOON", start_time: "17:22", generated_from: 31},
        stops: [
            {stop_id: 5, stop_order: 1},
            {stop_id: 27, stop_order: 2},
            {stop_id: 26, stop_order: 3},
            {stop_id: 17, stop_order: 4},
            {stop_id: 34, stop_order: 5},
            {stop_id: 40, stop_order: 6},
        ],
    },

    // === TUYẾN 17 – GÒ VẤP → BÌNH THẠNH → ĐH SÀI GÒN CS2 ===
    {
        route: {route_id: 33, route_type: "MORNING", start_time: "06:28", generated_from: null},
        stops: [
            {stop_id: 35, stop_order: 1},
            {stop_id: 17, stop_order: 2},
            {stop_id: 16, stop_order: 3},
            {stop_id: 23, stop_order: 4},
            {stop_id: 21, stop_order: 5},
            {stop_id: 3, stop_order: 6},
        ],
    },
    {
        route: {route_id: 34, route_type: "AFTERNOON", start_time: "17:28", generated_from: 33},
        stops: [
            {stop_id: 3, stop_order: 1},
            {stop_id: 21, stop_order: 2},
            {stop_id: 23, stop_order: 3},
            {stop_id: 16, stop_order: 4},
            {stop_id: 17, stop_order: 5},
            {stop_id: 35, stop_order: 6},
        ],
    },

    // === TUYẾN 18 – Q.7 → Q.4 → ĐH RMIT ===
    {
        route: {route_id: 35, route_type: "MORNING", start_time: "06:32", generated_from: null},
        stops: [
            {stop_id: 8, stop_order: 1},
            {stop_id: 9, stop_order: 2},
            {stop_id: 10, stop_order: 3},
            {stop_id: 11, stop_order: 4},
            {stop_id: 19, stop_order: 5},
            {stop_id: 4, stop_order: 6},
        ],
    },
    {
        route: {route_id: 36, route_type: "AFTERNOON", start_time: "17:32", generated_from: 35},
        stops: [
            {stop_id: 4, stop_order: 1},
            {stop_id: 19, stop_order: 2},
            {stop_id: 11, stop_order: 3},
            {stop_id: 10, stop_order: 4},
            {stop_id: 9, stop_order: 5},
            {stop_id: 8, stop_order: 6},
        ],
    },

    // === TUYẾN 19 – HÓC MÔN → GÒ VẤP → ĐH SÀI GÒN CS1 ===
    {
        route: {route_id: 37, route_type: "MORNING", start_time: "06:08", generated_from: null},
        stops: [
            {stop_id: 31, stop_order: 1},
            {stop_id: 32, stop_order: 2},
            {stop_id: 33, stop_order: 3},
            {stop_id: 34, stop_order: 4},
            {stop_id: 17, stop_order: 5},
            {stop_id: 2, stop_order: 6},
        ],
    },
    {
        route: {route_id: 38, route_type: "AFTERNOON", start_time: "17:08", generated_from: 37},
        stops: [
            {stop_id: 2, stop_order: 1},
            {stop_id: 17, stop_order: 2},
            {stop_id: 34, stop_order: 3},
            {stop_id: 33, stop_order: 4},
            {stop_id: 32, stop_order: 5},
            {stop_id: 31, stop_order: 6},
        ],
    },

    // === TUYẾN 20 – BÌNH TÂN → Q.6 → ĐH KHTN ===
    {
        route: {route_id: 39, route_type: "MORNING", start_time: "06:33", generated_from: null},
        stops: [
            {stop_id: 28, stop_order: 1},
            {stop_id: 15, stop_order: 2},
            {stop_id: 13, stop_order: 3},
            {stop_id: 14, stop_order: 4},
            {stop_id: 7, stop_order: 5},
        ],
    },
    {
        route: {route_id: 40, route_type: "AFTERNOON", start_time: "17:33", generated_from: 39},
        stops: [
            {stop_id: 7, stop_order: 1},
            {stop_id: 14, stop_order: 2},
            {stop_id: 13, stop_order: 3},
            {stop_id: 15, stop_order: 4},
            {stop_id: 28, stop_order: 5},
        ],
    },

    // === TUYẾN 21 – PHÚ NHUẬN → Q.3 → ĐH SÀI GÒN CHÍNH ===
    {
        route: {route_id: 41, route_type: "MORNING", start_time: "06:38", generated_from: null},
        stops: [
            {stop_id: 21, stop_order: 1},
            {stop_id: 20, stop_order: 2},
            {stop_id: 18, stop_order: 3},
            {stop_id: 19, stop_order: 4},
            {stop_id: 14, stop_order: 5},
            {stop_id: 1, stop_order: 6},
        ],
    },
    {
        route: {route_id: 42, route_type: "AFTERNOON", start_time: "17:38", generated_from: 41},
        stops: [
            {stop_id: 1, stop_order: 1},
            {stop_id: 14, stop_order: 2},
            {stop_id: 19, stop_order: 3},
            {stop_id: 18, stop_order: 4},
            {stop_id: 20, stop_order: 5},
            {stop_id: 21, stop_order: 6},
        ],
    },

    // === TUYẾN 22 – THỦ ĐỨC → LANDMARK → ĐH FPT ===
    {
        route: {route_id: 43, route_type: "MORNING", start_time: "06:42", generated_from: null},
        stops: [
            {stop_id: 25, stop_order: 1},
            {stop_id: 24, stop_order: 2},
            {stop_id: 23, stop_order: 3},
            {stop_id: 26, stop_order: 4},
            {stop_id: 27, stop_order: 5},
            {stop_id: 5, stop_order: 6},
        ],
    },
    {
        route: {route_id: 44, route_type: "AFTERNOON", start_time: "17:42", generated_from: 43},
        stops: [
            {stop_id: 5, stop_order: 1},
            {stop_id: 27, stop_order: 2},
            {stop_id: 26, stop_order: 3},
            {stop_id: 23, stop_order: 4},
            {stop_id: 24, stop_order: 5},
            {stop_id: 25, stop_order: 6},
        ],
    },

    // === TUYẾN 23 – Q.7 → Q.1 → ĐH KHTN ===
    {
        route: {route_id: 45, route_type: "MORNING", start_time: "06:45", generated_from: null},
        stops: [
            {stop_id: 11, stop_order: 1},
            {stop_id: 10, stop_order: 2},
            {stop_id: 9, stop_order: 3},
            {stop_id: 19, stop_order: 4},
            {stop_id: 14, stop_order: 5},
            {stop_id: 7, stop_order: 6},
        ],
    },
    {
        route: {route_id: 46, route_type: "AFTERNOON", start_time: "17:45", generated_from: 45},
        stops: [
            {stop_id: 7, stop_order: 1},
            {stop_id: 14, stop_order: 2},
            {stop_id: 19, stop_order: 3},
            {stop_id: 9, stop_order: 4},
            {stop_id: 10, stop_order: 5},
            {stop_id: 11, stop_order: 6},
        ],
    },

    // === TUYẾN 24 – HÓC MÔN → QUỐC LỘ 22 → ĐH SÀI GÒN CS2 ===
    {
        route: {route_id: 47, route_type: "MORNING", start_time: "06:48", generated_from: null},
        stops: [
            {stop_id: 32, stop_order: 1},
            {stop_id: 33, stop_order: 2},
            {stop_id: 31, stop_order: 3},
            {stop_id: 35, stop_order: 4},
            {stop_id: 17, stop_order: 5},
            {stop_id: 3, stop_order: 6},
        ],
    },
    {
        route: {route_id: 48, route_type: "AFTERNOON", start_time: "17:48", generated_from: 47},
        stops: [
            {stop_id: 3, stop_order: 1},
            {stop_id: 17, stop_order: 2},
            {stop_id: 35, stop_order: 3},
            {stop_id: 31, stop_order: 4},
            {stop_id: 33, stop_order: 5},
            {stop_id: 32, stop_order: 6},
        ],
    },

    // === TUYẾN 25 – BÌNH CHÁNH → Q.8 → ĐH SÀI GÒN CHÍNH ===
    {
        route: {route_id: 49, route_type: "MORNING", start_time: "06:55", generated_from: null},
        stops: [
            {stop_id: 29, stop_order: 1},
            {stop_id: 28, stop_order: 2},
            {stop_id: 12, stop_order: 3},
            {stop_id: 15, stop_order: 4},
            {stop_id: 13, stop_order: 5},
            {stop_id: 1, stop_order: 6},
        ],
    },
    {
        route: {route_id: 50, route_type: "AFTERNOON", start_time: "17:55", generated_from: 49},
        stops: [
            {stop_id: 1, stop_order: 1},
            {stop_id: 13, stop_order: 2},
            {stop_id: 15, stop_order: 3},
            {stop_id: 12, stop_order: 4},
            {stop_id: 28, stop_order: 5},
            {stop_id: 29, stop_order: 6},
        ],
    },
];

module.exports = routesData;
