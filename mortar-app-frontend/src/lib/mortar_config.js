export const MAP_SCALE_METERS_PER_PIXEL = (0.86430423509 ) / 1.000;

export const mortarTypes = {
  "2B-14 Mortar" : {
    mortar_name: "2B-14 Mortar",
    ammo_types: [
      {
        name: "HE Shell",
        min_range: 50,
        max_range: 2300,
        ballistics: {
          dispersions : [
            8.0,
            13.0,
            19.0,
            27.0,
            34.0
          ],
          rings: [
            // Ring 0 (outermost)
            [
              { range: 50,  elevation_mils: 1455, time_to_impact: 15.0 },
              { range: 100, elevation_mils: 1411, time_to_impact: 15.0 },
              { range: 150, elevation_mils: 1365, time_to_impact: 14.9 },
              { range: 200, elevation_mils: 1318, time_to_impact: 14.8 },
              { range: 250, elevation_mils: 1268, time_to_impact: 14.6 },
              { range: 300, elevation_mils: 1217, time_to_impact: 14.4 },
              { range: 350, elevation_mils: 1159, time_to_impact: 14.1 },
              { range: 400, elevation_mils: 1095, time_to_impact: 13.7 },
              { range: 450, elevation_mils: 1023, time_to_impact: 13.2 },
              { range: 500, elevation_mils: 922, time_to_impact: 12.4 }
            ],
            // Ring 1
            [
              { range: 100, elevation_mils: 1446, time_to_impact: 19.5 },
              { range: 200, elevation_mils: 1392, time_to_impact: 19.5 },
              { range: 300, elevation_mils: 1335, time_to_impact: 19.2 },
              { range: 400, elevation_mils: 1275, time_to_impact: 18.9 },
              { range: 500, elevation_mils: 1212, time_to_impact: 18.6 },
              { range: 600, elevation_mils: 1141, time_to_impact: 18.1 },
              { range: 700, elevation_mils: 1058, time_to_impact: 17.4 },
              { range: 800, elevation_mils: 952, time_to_impact: 16.4 }
            ],
            // Ring 2
            [
              { range: 200, elevation_mils: 1432, time_to_impact: 24.8 },
              { range: 300, elevation_mils: 1397, time_to_impact: 24.7 },
              { range: 400, elevation_mils: 1362, time_to_impact: 24.6 },
              { range: 500, elevation_mils: 1325, time_to_impact: 24.4 },
              { range: 600, elevation_mils: 1288, time_to_impact: 24.2 },
              { range: 700, elevation_mils: 1248, time_to_impact: 24.0 },
              { range: 800, elevation_mils: 1207, time_to_impact: 23.7 },
              { range: 900, elevation_mils: 1162, time_to_impact: 23.3 },
              { range: 1000, elevation_mils: 1114, time_to_impact: 22.9 },
              { range: 1100, elevation_mils: 1060, time_to_impact: 22.3 },
              { range: 1200, elevation_mils: 997, time_to_impact: 21.5 },
              { range: 1300, elevation_mils: 914, time_to_impact: 20.4 },
              { range: 1400, elevation_mils: 755, time_to_impact: 17.8 }
            ],
            // Ring 3
            [
              { range: 300,  elevation_mils: 1423, time_to_impact: 28.9 },
              { range: 400,  elevation_mils: 1397, time_to_impact: 28.9 },
              { range: 500,  elevation_mils: 1370, time_to_impact: 28.8 },
              { range: 600,  elevation_mils: 1343, time_to_impact: 28.6 },
              { range: 700,  elevation_mils: 1315, time_to_impact: 28.5 },
              { range: 800,  elevation_mils: 1286, time_to_impact: 28.3 },
              { range: 900,  elevation_mils: 1257, time_to_impact: 28.1 },
              { range: 1000, elevation_mils: 1226, time_to_impact: 27.9 },
              { range: 1100, elevation_mils: 1193, time_to_impact: 27.6 },
              { range: 1200, elevation_mils: 1159, time_to_impact: 27.2 },
              { range: 1300, elevation_mils: 1123, time_to_impact: 26.8 },
              { range: 1400, elevation_mils: 1084, time_to_impact: 26.4 },
              { range: 1500, elevation_mils: 1040, time_to_impact: 25.8 },
              { range: 1600, elevation_mils: 991, time_to_impact: 25.1 },
              { range: 1700, elevation_mils: 932, time_to_impact: 24.2 },
              { range: 1800, elevation_mils: 851, time_to_impact: 22.8 }
            ],
            // Ring 4
            [
              { range: 400,  elevation_mils: 1418, time_to_impact: 32.9 },
              { range: 500,  elevation_mils: 1398, time_to_impact: 32.9 },
              { range: 600,  elevation_mils: 1376, time_to_impact: 32.8 },
              { range: 700,  elevation_mils: 1355, time_to_impact: 32.7 },
              { range: 800,  elevation_mils: 1333, time_to_impact: 32.6 },
              { range: 900,  elevation_mils: 1311, time_to_impact: 32.4 },
              { range: 1000, elevation_mils: 1288, time_to_impact: 32.2 },
              { range: 1100, elevation_mils: 1264, time_to_impact: 32.1 },
              { range: 1200, elevation_mils: 1240, time_to_impact: 31.8 },
              { range: 1300, elevation_mils: 1215, time_to_impact: 31.6 },
              { range: 1400, elevation_mils: 1189, time_to_impact: 31.3 },
              { range: 1500, elevation_mils: 1161, time_to_impact: 31.0 },
              { range: 1600, elevation_mils: 1133, time_to_impact: 30.7 },
              { range: 1700, elevation_mils: 1102, time_to_impact: 30.3 },
              { range: 1800, elevation_mils: 1069, time_to_impact: 29.8 },
              { range: 1900, elevation_mils: 1034, time_to_impact: 29.3 },
              { range: 2000, elevation_mils: 995, time_to_impact: 28.7 },
              { range: 2100, elevation_mils: 950, time_to_impact: 27.9 },
              { range: 2200, elevation_mils: 896, time_to_impact: 26.9 },
              { range: 2300, elevation_mils: 820, time_to_impact: 25.3 }
            ]            
          ]
        }
      },
      {
        name: "Smoke Shell",
        min_range: 50,
        max_range: 1700,
        ballistics: {
          dispersions : [
            0.0,
            0.0,
            0.0,
            0.0
          ],
          rings: [
            // Ring 0 (outermost)
            [
              { range: 50, elevation_mils: 1450, time_to_impact: 14.1 },
              { range: 100, elevation_mils: 1399, time_to_impact: 14.0 },
              { range: 150, elevation_mils: 1347, time_to_impact: 13.9 },
              { range: 200, elevation_mils: 1292, time_to_impact: 13.8 },
              { range: 250, elevation_mils: 1235, time_to_impact: 13.6 },
              { range: 300, elevation_mils: 1172, time_to_impact: 13.3 },
              { range: 350, elevation_mils: 1102, time_to_impact: 12.9 },
              { range: 400, elevation_mils: 1020, time_to_impact: 12.4 },
              { range: 450, elevation_mils: 898, time_to_impact: 11.4 }
            ],
            // Ring 1
            [
              { range: 200, elevation_mils: 1381, time_to_impact: 18.4 },
              { range: 300, elevation_mils: 1319, time_to_impact: 18.2 },
              { range: 400, elevation_mils: 1252, time_to_impact: 17.9 },
              { range: 500, elevation_mils: 1179, time_to_impact: 17.5 },
              { range: 600, elevation_mils: 1097, time_to_impact: 16.9 },
              { range: 700, elevation_mils: 993, time_to_impact: 16.0 },
              { range: 800, elevation_mils: 805, time_to_impact: 13.9 }
            ],
            // Ring 2
            [
              { range: 300,  elevation_mils: 1387, time_to_impact: 23.5 },
              { range: 400,  elevation_mils: 1348, time_to_impact: 23.3 },
              { range: 500,  elevation_mils: 1308, time_to_impact: 23.2 },
              { range: 600,  elevation_mils: 1266, time_to_impact: 22.9 },
              { range: 700,  elevation_mils: 1222, time_to_impact: 22.7 },
              { range: 800,  elevation_mils: 1175, time_to_impact: 22.3 },
              { range: 900,  elevation_mils: 1123, time_to_impact: 21.8 },
              { range: 1000, elevation_mils: 1065, time_to_impact: 21.3 },
              { range: 1100, elevation_mils: 994, time_to_impact: 20.4 },
              { range: 1200, elevation_mils: 902, time_to_impact: 19.2 }
            ],
            // Ring 3
            [
              { range: 400,  elevation_mils: 1387, time_to_impact: 27.3 },
              { range: 500,  elevation_mils: 1357, time_to_impact: 27.2 },
              { range: 600,  elevation_mils: 1327, time_to_impact: 27.1 },
              { range: 700,  elevation_mils: 1296, time_to_impact: 26.9 },
              { range: 800,  elevation_mils: 1264, time_to_impact: 26.7 },
              { range: 900,  elevation_mils: 1231, time_to_impact: 26.5 },
              { range: 1000, elevation_mils: 1196, time_to_impact: 26.2 },
              { range: 1100, elevation_mils: 1159, time_to_impact: 25.8 },
              { range: 1200, elevation_mils: 1119, time_to_impact: 25.4 },
              { range: 1300, elevation_mils: 1075, time_to_impact: 24.9 },
              { range: 1400, elevation_mils: 1026, time_to_impact: 24.3 },
              { range: 1500, elevation_mils: 969, time_to_impact: 23.5 },
              { range: 1600, elevation_mils: 896, time_to_impact: 22.3 },
              { range: 1700, elevation_mils: 753, time_to_impact: 19.8 }
            ]
          ]
        }
      },
      {
        name: "Flare Shell",
        min_range: 100,
        max_range: 2200,
        ballistics: {
          dispersions : [
            0.0,
            0.0,
            0.0,
            0.0
          ],
          rings: [
            // Ring 1 (outermost)
            [
              { range: 100, elevation_mils: 1421, time_to_impact: 16.4 },
              { range: 150, elevation_mils: 1381, time_to_impact: 16.3 },
              { range: 200, elevation_mils: 1339, time_to_impact: 16.2 },
              { range: 250, elevation_mils: 1296, time_to_impact: 16.1 },
              { range: 300, elevation_mils: 1251, time_to_impact: 15.9 },
              { range: 350, elevation_mils: 1203, time_to_impact: 15.7 },
              { range: 400, elevation_mils: 1151, time_to_impact: 15.4 },
              { range: 450, elevation_mils: 1093, time_to_impact: 15.0 },
              { range: 500, elevation_mils: 1028, time_to_impact: 14.5 },
              { range: 550, elevation_mils: 945, time_to_impact: 13.8 },
              { range: 600, elevation_mils: 799, time_to_impact: 12.3 }
            ],
            // Ring 2
            [
              { range: 200, elevation_mils: 1417, time_to_impact: 23.6 },
              { range: 300, elevation_mils: 1374, time_to_impact: 23.5 },
              { range: 400, elevation_mils: 1330, time_to_impact: 23.3 },
              { range: 500, elevation_mils: 1284 , time_to_impact: 23.1 },
              { range: 600, elevation_mils: 1234, time_to_impact: 22.8 },
              { range: 700, elevation_mils: 1182, time_to_impact: 22.4 },
              { range: 800, elevation_mils: 1124, time_to_impact: 21.9 },
              { range: 900, elevation_mils: 1057, time_to_impact: 21.3 },
              { range: 1000, elevation_mils: 979, time_to_impact: 20.4 },
              { range: 1100, elevation_mils: 870, time_to_impact: 18.9 }
            ],
            // Ring 3
            [
              { range: 300,  elevation_mils: 1411, time_to_impact: 29.0 },
              { range: 400,  elevation_mils: 1380, time_to_impact: 28.9 },
              { range: 500,  elevation_mils: 1348, time_to_impact: 28.7 },
              { range: 600,  elevation_mils: 1315, time_to_impact: 28.6 },
              { range: 700,  elevation_mils: 1281, time_to_impact: 28.4 },
              { range: 800,  elevation_mils: 1246, time_to_impact: 28.1 },
              { range: 900,  elevation_mils: 1209, time_to_impact: 27.8 },
              { range: 1000, elevation_mils: 1170, time_to_impact: 27.4 },
              { range: 1100, elevation_mils: 1128, time_to_impact: 27.0 },
              { range: 1200, elevation_mils: 1082, time_to_impact: 26.5 },
              { range: 1300, elevation_mils: 1031, time_to_impact: 25.8 },
              { range: 1400, elevation_mils: 973, time_to_impact: 25.0 },
              { range: 1500, elevation_mils: 903, time_to_impact: 23.9 },
              { range: 1600, elevation_mils: 807, time_to_impact: 22.3 }
            ],
            // Ring 4
            [
              { range: 400,  elevation_mils: 1411, time_to_impact: 35.3 },
              { range: 500,  elevation_mils: 1388, time_to_impact: 35.2 },
              { range: 600,  elevation_mils: 1364, time_to_impact: 35.1 },
              { range: 700,  elevation_mils: 1341, time_to_impact: 35.0 },
              { range: 800,  elevation_mils: 1316, time_to_impact: 34.8 },
              { range: 900,  elevation_mils: 1291, time_to_impact: 34.7 },
              { range: 1000, elevation_mils: 1265, time_to_impact: 34.4 },
              { range: 1100, elevation_mils: 1238, time_to_impact: 34.2 },
              { range: 1200, elevation_mils: 1210, time_to_impact: 33.9 },
              { range: 1300, elevation_mils: 1181, time_to_impact: 33.6 },
              { range: 1400, elevation_mils: 1150, time_to_impact: 33.2 },
              { range: 1500, elevation_mils: 1119, time_to_impact: 32.8 },
              { range: 1600, elevation_mils: 1085, time_to_impact: 32.4 },
              { range: 1700, elevation_mils: 1048, time_to_impact: 31.8 },
              { range: 1800, elevation_mils: 1009, time_to_impact: 31.2 },
              { range: 1900, elevation_mils: 965, time_to_impact: 30.4 },
              { range: 2000, elevation_mils: 917, time_to_impact: 29.6 },
              { range: 2100, elevation_mils: 860, time_to_impact: 28.4 },
              { range: 2200, elevation_mils: 787, time_to_impact: 26.9 }
            ]
          ]
        }
      }
    ]
  },
  "82mm Mortar" : {
    mortar_name: "82mm Mortar",
    ammo_types: [
      {
        name: "HE Shell",
        min_range: 50,
        max_range: 2900,
        ballistics: {
          dispersions : [
            6.0,
            14.0,
            24.0,
            33.0,
            42.0
          ],
          // Each ring contains an array of range/elevation pairs
          rings: [
            // Ring 0 (outermost)
            [
              { range: 50,  elevation_mils: 1540, time_to_impact: 13.2 },
              { range: 100, elevation_mils: 1479, time_to_impact: 13.2 },
              { range: 150, elevation_mils: 1416, time_to_impact: 13.0 },
              { range: 200, elevation_mils: 1350, time_to_impact: 12.8 },
              { range: 250, elevation_mils: 1279, time_to_impact: 12.6 },
              { range: 300, elevation_mils: 1201, time_to_impact: 12.3 },
              { range: 350, elevation_mils: 1106, time_to_impact: 11.7 },
              { range: 400, elevation_mils:  955, time_to_impact: 10.7 },
            ],
            // Ring 1
            [
              { range: 100, elevation_mils: 1547, time_to_impact: 20.0 },
              { range: 200, elevation_mils: 1492, time_to_impact: 19.9 },
              { range: 300, elevation_mils: 1437, time_to_impact: 19.7 },
              { range: 400, elevation_mils: 1378, time_to_impact: 19.5 },
              { range: 500, elevation_mils: 1317, time_to_impact: 19.2 },
              { range: 600, elevation_mils: 1249, time_to_impact: 18.8 },
              { range: 700, elevation_mils: 1174, time_to_impact: 18.3 },
              { range: 800, elevation_mils: 1085, time_to_impact: 17.5 },
              { range: 900, elevation_mils: 954, time_to_impact: 16.1  },
            ],
            // Ring 2
            [
              { range: 200,  elevation_mils: 1538, time_to_impact: 26.6 },
              { range: 300,  elevation_mils: 1507, time_to_impact: 26.5 },
              { range: 400,  elevation_mils: 1475, time_to_impact: 26.4 },
              { range: 500,  elevation_mils: 1443, time_to_impact: 26.3 },
              { range: 600,  elevation_mils: 1410, time_to_impact: 26.2 },
              { range: 700,  elevation_mils: 1376, time_to_impact: 26.0 },
              { range: 800,  elevation_mils: 1341, time_to_impact: 25.8 },
              { range: 900,  elevation_mils: 1305, time_to_impact: 25.5 },
              { range: 1000, elevation_mils: 1266, time_to_impact: 25.2 },
              { range: 1100, elevation_mils: 1225, time_to_impact: 24.9 },
              { range: 1200, elevation_mils: 1180, time_to_impact: 24.4 },
              { range: 1300, elevation_mils: 1132, time_to_impact: 23.9 },
              { range: 1400, elevation_mils: 1076, time_to_impact: 23.2 },
              { range: 1500, elevation_mils: 1009, time_to_impact: 22.3 },
              { range: 1600, elevation_mils:  912, time_to_impact: 20.9 },
            ],
            // Ring 3
            [
              { range: 300,  elevation_mils: 1534, time_to_impact: 31.7 },
              { range: 400,  elevation_mils: 1511, time_to_impact: 31.6 },
              { range: 500,  elevation_mils: 1489, time_to_impact: 31.6 },
              { range: 600,  elevation_mils: 1466, time_to_impact: 31.5 },
              { range: 700,  elevation_mils: 1442, time_to_impact: 31.4 },
              { range: 800,  elevation_mils: 1419, time_to_impact: 31.3 },
              { range: 900,  elevation_mils: 1395, time_to_impact: 31.1 },
              { range: 1000, elevation_mils: 1370, time_to_impact: 31.0 },
              { range: 1100, elevation_mils: 1344, time_to_impact: 30.8 },
              { range: 1200, elevation_mils: 1318, time_to_impact: 30.6 },
              { range: 1300, elevation_mils: 1291, time_to_impact: 30.3 },
              { range: 1400, elevation_mils: 1263, time_to_impact: 30.1 },
              { range: 1500, elevation_mils: 1233, time_to_impact: 29.7 },
              { range: 1600, elevation_mils: 1202, time_to_impact: 29.4 },
              { range: 1700, elevation_mils: 1169, time_to_impact: 29.0 },
              { range: 1800, elevation_mils: 1133, time_to_impact: 28.5 },
              { range: 1900, elevation_mils: 1094, time_to_impact: 28.0 },
              { range: 2000, elevation_mils: 1051, time_to_impact: 27.3 },
              { range: 2100, elevation_mils:  999, time_to_impact: 26.5 },
              { range: 2200, elevation_mils:  931, time_to_impact: 25.3 },
              { range: 2300, elevation_mils:  801, time_to_impact: 22.7 },
            ],
            // Ring 4
            [
              { range: 400,  elevation_mils: 1531, time_to_impact: 36.3 },
              { range: 500,  elevation_mils: 1514, time_to_impact: 36.2 },
              { range: 600,  elevation_mils: 1496, time_to_impact: 36.2 },
              { range: 700,  elevation_mils: 1478, time_to_impact: 36.1 },
              { range: 800,  elevation_mils: 1460, time_to_impact: 36.0 },
              { range: 900,  elevation_mils: 1442, time_to_impact: 35.9 },
              { range: 1000, elevation_mils: 1424, time_to_impact: 35.8 },
              { range: 1100, elevation_mils: 1405, time_to_impact: 35.7 },
              { range: 1200, elevation_mils: 1385, time_to_impact: 35.6 },
              { range: 1300, elevation_mils: 1366, time_to_impact: 35.4 },
              { range: 1400, elevation_mils: 1346, time_to_impact: 35.3 },
              { range: 1500, elevation_mils: 1326, time_to_impact: 35.1 },
              { range: 1600, elevation_mils: 1305, time_to_impact: 34.9 },
              { range: 1700, elevation_mils: 1283, time_to_impact: 34.6 },
              { range: 1800, elevation_mils: 1261, time_to_impact: 34.6 },
              { range: 1900, elevation_mils: 1238, time_to_impact: 34.4 },
              { range: 2000, elevation_mils: 1214, time_to_impact: 33.8 },
              { range: 2100, elevation_mils: 1188, time_to_impact: 33.5 },
              { range: 2200, elevation_mils: 1162, time_to_impact: 33.1 },
              { range: 2300, elevation_mils: 1134, time_to_impact: 32.7 },
              { range: 2400, elevation_mils: 1104, time_to_impact: 32.2 },
              { range: 2500, elevation_mils: 1070, time_to_impact: 31.7 },
              { range: 2600, elevation_mils: 1034, time_to_impact: 31.0 },
              { range: 2700, elevation_mils:  993, time_to_impact: 30.3 },
              { range: 2800, elevation_mils:  942, time_to_impact: 29.2 },
              { range: 2900, elevation_mils:  870, time_to_impact: 27.7 },
            ]
          ]
        }
      },
      {
        name: "Smoke Shell",
        min_range: 100,
        max_range: 1800,
        ballistics: {
          rings: [
            // Ring 1 (outermost)
            [
              { range: 200, elevation_mils: 1463, time_to_impact: 17.7 },
              { range: 250, elevation_mils: 1427, time_to_impact: 17.6 },
              { range: 300, elevation_mils: 1391, time_to_impact: 17.5 },
              { range: 350, elevation_mils: 1352, time_to_impact: 17.3 },
              { range: 400, elevation_mils: 1314, time_to_impact: 17.2 },
              { range: 450, elevation_mils: 1271, time_to_impact: 16.9 },
              { range: 500, elevation_mils: 1227, time_to_impact: 16.7 },
              { range: 550, elevation_mils: 1178, time_to_impact: 16.4 },
              { range: 600, elevation_mils: 1124, time_to_impact: 16.0 },
              { range: 650, elevation_mils: 1060, time_to_impact: 15.4 },
              { range: 700, elevation_mils: 982, time_to_impact: 14.7 },
              { range: 750, elevation_mils: 822, time_to_impact: 13.0 }
            ],
            // Ring 2
            [
              { range: 200, elevation_mils: 1528, time_to_impact: 24.8 },
              { range: 300, elevation_mils: 1491, time_to_impact: 24.7 },
              { range: 400, elevation_mils: 1453, time_to_impact: 24.6 },
              { range: 500, elevation_mils: 1414, time_to_impact: 24.4 }, 
              { range: 600, elevation_mils: 1333, time_to_impact: 24.2 }, 
              { range: 700, elevation_mils: 1414, time_to_impact: 24.0 }, 
              { range: 800, elevation_mils: 1289, time_to_impact: 23.7 }, 
              { range: 900, elevation_mils: 1242, time_to_impact: 23.3 }, 
              { range: 1000, elevation_mils: 1191, time_to_impact: 22.9 }, 
              { range: 1100, elevation_mils: 1133, time_to_impact: 22.3 }, 
              { range: 1200, elevation_mils: 1067, time_to_impact: 21.6 }, 
              { range: 1300, elevation_mils: 980, time_to_impact: 20.5 }, 
              { range: 1400, elevation_mils: 818, time_to_impact: 18.0 }
            ],
            // Ring 3
            [
              { range: 300, elevation_mils: 853, time_to_impact: 29.6 },
              { range: 400, elevation_mils: 1031, time_to_impact: 29.6 },
              { range: 500, elevation_mils: 1316, time_to_impact: 29.5 },
              { range: 600, elevation_mils: 1564, time_to_impact: 29.3 },
              { range: 700, elevation_mils: 1412, time_to_impact: 29.2 }, 
              { range: 800, elevation_mils: 1383, time_to_impact: 29.0 }, 
              { range: 900, elevation_mils: 1354, time_to_impact: 28.9 }, 
              { range: 1000, elevation_mils: 1323, time_to_impact: 28.6 }, 
              { range: 1100, elevation_mils: 1291, time_to_impact: 28.4 }, 
              { range: 1200, elevation_mils: 1257, time_to_impact: 28.1 }, 
              { range: 1300, elevation_mils: 1221, time_to_impact: 27.7 }, 
              { range: 1400, elevation_mils: 1183, time_to_impact: 27.3 }, 
              { range: 1500, elevation_mils: 1142, time_to_impact: 26.8 },
              { range: 1600, elevation_mils: 1096, time_to_impact: 26.2 },
              { range: 1700, elevation_mils: 1044, time_to_impact: 25.5 }, 
              { range: 1800, elevation_mils: 980, time_to_impact: 24.5 }, 
              { range: 1900, elevation_mils: 892, time_to_impact: 23.0 } 
            ],
            // Ring 4
            [
              { range: 400, elevation_mils: 907, time_to_impact: 33.6 },
              { range: 500, elevation_mils: 1084, time_to_impact: 33.5 },
              { range: 600, elevation_mils: 1369, time_to_impact: 33.5 },
              { range: 700, elevation_mils: 1618, time_to_impact: 33.4 }, 
              { range: 800, elevation_mils: 1429, time_to_impact: 33.2 },
              { range: 900, elevation_mils: 1407, time_to_impact: 33.1 }, 
              { range: 1000, elevation_mils: 1383, time_to_impact: 33.0 }, 
              { range: 1100, elevation_mils: 1360, time_to_impact: 32.8 }, 
              { range: 1200, elevation_mils: 1335, time_to_impact: 32.6 },
              { range: 1300, elevation_mils: 1310, time_to_impact: 32.4 },
              { range: 1400, elevation_mils: 1284, time_to_impact: 32.1 },
              { range: 1500, elevation_mils: 1257, time_to_impact: 31.9 },
              { range: 1600, elevation_mils: 1228, time_to_impact: 31.5 },
              { range: 1700, elevation_mils: 1199, time_to_impact: 31.2 }, 
              { range: 1800, elevation_mils: 1166, time_to_impact: 30.8 }, 
              { range: 1900, elevation_mils: 1132, time_to_impact: 30.3 }, 
              { range: 2000, elevation_mils: 1096, time_to_impact: 29.8 }, 
              { range: 2100, elevation_mils: 1055, time_to_impact: 29.1 }, 
              { range: 2200, elevation_mils: 1008, time_to_impact: 28.4 },
              { range: 2300, elevation_mils: 952, time_to_impact: 27.4 }, 
              { range: 2400, elevation_mils: 871, time_to_impact: 25.8 }
            ]
          ]
        }
      }
    ]
  }
}; 