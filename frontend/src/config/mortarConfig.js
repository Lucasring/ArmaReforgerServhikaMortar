export const MAP_SCALE_METERS_PER_PIXEL = (0.43588888888) / 1.007;

export const mortarTypes = [
  {
    name: "2B-14 Mortar",
    ammo: [
      {
        name: "HE Shell",
        minRange: 50,
        maxRange: 2300,
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
              { range: 50,  elevationMils: 1455, timeToImpactSeconds: 15.0 },
              { range: 100, elevationMils: 1411, timeToImpactSeconds: 15.0 },
              { range: 150, elevationMils: 1365, timeToImpactSeconds: 14.9 },
              { range: 200, elevationMils: 1318, timeToImpactSeconds: 14.8 },
              { range: 250, elevationMils: 1268, timeToImpactSeconds: 14.6 },
              { range: 300, elevationMils: 1217, timeToImpactSeconds: 14.4 },
              { range: 350, elevationMils: 1159, timeToImpactSeconds: 14.1 },
              { range: 400, elevationMils: 1095, timeToImpactSeconds: 13.7 },
              { range: 450, elevationMils: 1023, timeToImpactSeconds: 13.2 },
              { range: 500, elevationMils: 922, timeToImpactSeconds: 12.4 }
            ],
            // Ring 1
            [
              { range: 100, elevationMils: 1446, timeToImpactSeconds: 19.5 },
              { range: 200, elevationMils: 1392, timeToImpactSeconds: 19.5 },
              { range: 300, elevationMils: 1335, timeToImpactSeconds: 19.2 },
              { range: 400, elevationMils: 1275, timeToImpactSeconds: 18.9 },
              { range: 500, elevationMils: 1212, timeToImpactSeconds: 18.6 },
              { range: 600, elevationMils: 1141, timeToImpactSeconds: 18.1 },
              { range: 700, elevationMils: 1058, timeToImpactSeconds: 17.4 },
              { range: 800, elevationMils: 952, timeToImpactSeconds: 16.4 }
            ],
            // Ring 2
            [
              { range: 200, elevationMils: 1432, timeToImpactSeconds: 24.8 },
              { range: 300, elevationMils: 1397, timeToImpactSeconds: 24.7 },
              { range: 400, elevationMils: 1362, timeToImpactSeconds: 24.6 },
              { range: 500, elevationMils: 1325, timeToImpactSeconds: 24.4 },
              { range: 600, elevationMils: 1288, timeToImpactSeconds: 24.2 },
              { range: 700, elevationMils: 1248, timeToImpactSeconds: 24.0 },
              { range: 800, elevationMils: 1207, timeToImpactSeconds: 23.7 },
              { range: 900, elevationMils: 1162, timeToImpactSeconds: 23.3 },
              { range: 1000, elevationMils: 1114, timeToImpactSeconds: 22.9 },
              { range: 1100, elevationMils: 1060, timeToImpactSeconds: 22.3 },
              { range: 1200, elevationMils: 997, timeToImpactSeconds: 21.5 },
              { range: 1300, elevationMils: 914, timeToImpactSeconds: 20.4 },
              { range: 1400, elevationMils: 755, timeToImpactSeconds: 17.8 }
            ],
            // Ring 3
            [
              { range: 300,  elevationMils: 1423, timeToImpactSeconds: 28.9 },
              { range: 400,  elevationMils: 1397, timeToImpactSeconds: 28.9 },
              { range: 500,  elevationMils: 1370, timeToImpactSeconds: 28.8 },
              { range: 600,  elevationMils: 1343, timeToImpactSeconds: 28.6 },
              { range: 700,  elevationMils: 1315, timeToImpactSeconds: 28.5 },
              { range: 800,  elevationMils: 1286, timeToImpactSeconds: 28.3 },
              { range: 900,  elevationMils: 1257, timeToImpactSeconds: 28.1 },
              { range: 1000, elevationMils: 1226, timeToImpactSeconds: 27.9 },
              { range: 1100, elevationMils: 1193, timeToImpactSeconds: 27.6 },
              { range: 1200, elevationMils: 1159, timeToImpactSeconds: 27.2 },
              { range: 1300, elevationMils: 1123, timeToImpactSeconds: 26.8 },
              { range: 1400, elevationMils: 1084, timeToImpactSeconds: 26.4 },
              { range: 1500, elevationMils: 1040, timeToImpactSeconds: 25.8 },
              { range: 1600, elevationMils: 991, timeToImpactSeconds: 25.1 },
              { range: 1700, elevationMils: 932, timeToImpactSeconds: 24.2 },
              { range: 1800, elevationMils: 851, timeToImpactSeconds: 22.8 }
            ],
            // Ring 4
            [
              { range: 400,  elevationMils: 1418, timeToImpactSeconds: 32.9 },
              { range: 500,  elevationMils: 1398, timeToImpactSeconds: 32.9 },
              { range: 600,  elevationMils: 1376, timeToImpactSeconds: 32.8 },
              { range: 700,  elevationMils: 1355, timeToImpactSeconds: 32.7 },
              { range: 800,  elevationMils: 1333, timeToImpactSeconds: 32.6 },
              { range: 900,  elevationMils: 1311, timeToImpactSeconds: 32.4 },
              { range: 1000, elevationMils: 1288, timeToImpactSeconds: 32.2 },
              { range: 1100, elevationMils: 1264, timeToImpactSeconds: 32.1 },
              { range: 1200, elevationMils: 1240, timeToImpactSeconds: 31.8 },
              { range: 1300, elevationMils: 1215, timeToImpactSeconds: 31.6 },
              { range: 1400, elevationMils: 1189, timeToImpactSeconds: 31.3 },
              { range: 1500, elevationMils: 1161, timeToImpactSeconds: 31.0 },
              { range: 1600, elevationMils: 1133, timeToImpactSeconds: 30.7 },
              { range: 1700, elevationMils: 1102, timeToImpactSeconds: 30.3 },
              { range: 1800, elevationMils: 1069, timeToImpactSeconds: 29.8 },
              { range: 1900, elevationMils: 1034, timeToImpactSeconds: 29.3 },
              { range: 2000, elevationMils: 995, timeToImpactSeconds: 28.7 },
              { range: 2100, elevationMils: 950, timeToImpactSeconds: 27.9 },
              { range: 2200, elevationMils: 896, timeToImpactSeconds: 26.9 },
              { range: 2300, elevationMils: 820, timeToImpactSeconds: 25.3 }
            ]            
          ]
        }
      },
      {
        name: "Smoke Shell",
        minRange: 50,
        maxRange: 1700,
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
              { range: 50, elevationMils: 1450, timeToImpactSeconds: 14.1 },
              { range: 100, elevationMils: 1399, timeToImpactSeconds: 14.0 },
              { range: 150, elevationMils: 1347, timeToImpactSeconds: 13.9 },
              { range: 200, elevationMils: 1292, timeToImpactSeconds: 13.8 },
              { range: 250, elevationMils: 1235, timeToImpactSeconds: 13.6 },
              { range: 300, elevationMils: 1172, timeToImpactSeconds: 13.3 },
              { range: 350, elevationMils: 1102, timeToImpactSeconds: 12.9 },
              { range: 400, elevationMils: 1020, timeToImpactSeconds: 12.4 },
              { range: 450, elevationMils: 898, timeToImpactSeconds: 11.4 }
            ],
            // Ring 1
            [
              { range: 200, elevationMils: 1381, timeToImpactSeconds: 18.4 },
              { range: 300, elevationMils: 1319, timeToImpactSeconds: 18.2 },
              { range: 400, elevationMils: 1252, timeToImpactSeconds: 17.9 },
              { range: 500, elevationMils: 1179, timeToImpactSeconds: 17.5 },
              { range: 600, elevationMils: 1097, timeToImpactSeconds: 16.9 },
              { range: 700, elevationMils: 993, timeToImpactSeconds: 16.0 },
              { range: 800, elevationMils: 805, timeToImpactSeconds: 13.9 }
            ],
            // Ring 2
            [
              { range: 300,  elevationMils: 1387, timeToImpactSeconds: 23.5 },
              { range: 400,  elevationMils: 1348, timeToImpactSeconds: 23.3 },
              { range: 500,  elevationMils: 1308, timeToImpactSeconds: 23.2 },
              { range: 600,  elevationMils: 1266, timeToImpactSeconds: 22.9 },
              { range: 700,  elevationMils: 1222, timeToImpactSeconds: 22.7 },
              { range: 800,  elevationMils: 1175, timeToImpactSeconds: 22.3 },
              { range: 900,  elevationMils: 1123, timeToImpactSeconds: 21.8 },
              { range: 1000, elevationMils: 1065, timeToImpactSeconds: 21.3 },
              { range: 1100, elevationMils: 994, timeToImpactSeconds: 20.4 },
              { range: 1200, elevationMils: 902, timeToImpactSeconds: 19.2 }
            ],
            // Ring 3
            [
              { range: 400,  elevationMils: 1387, timeToImpactSeconds: 27.3 },
              { range: 500,  elevationMils: 1357, timeToImpactSeconds: 27.2 },
              { range: 600,  elevationMils: 1327, timeToImpactSeconds: 27.1 },
              { range: 700,  elevationMils: 1296, timeToImpactSeconds: 26.9 },
              { range: 800,  elevationMils: 1264, timeToImpactSeconds: 26.7 },
              { range: 900,  elevationMils: 1231, timeToImpactSeconds: 26.5 },
              { range: 1000, elevationMils: 1196, timeToImpactSeconds: 26.2 },
              { range: 1100, elevationMils: 1159, timeToImpactSeconds: 25.8 },
              { range: 1200, elevationMils: 1119, timeToImpactSeconds: 25.4 },
              { range: 1300, elevationMils: 1075, timeToImpactSeconds: 24.9 },
              { range: 1400, elevationMils: 1026, timeToImpactSeconds: 24.3 },
              { range: 1500, elevationMils: 969, timeToImpactSeconds: 23.5 },
              { range: 1600, elevationMils: 896, timeToImpactSeconds: 22.3 },
              { range: 1700, elevationMils: 753, timeToImpactSeconds: 19.8 }
            ]
          ]
        }
      },
      {
        name: "Flare Shell",
        minRange: 100,
        maxRange: 2200,
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
              { range: 100, elevationMils: 1421, timeToImpactSeconds: 16.4 },
              { range: 150, elevationMils: 1381, timeToImpactSeconds: 16.3 },
              { range: 200, elevationMils: 1339, timeToImpactSeconds: 16.2 },
              { range: 250, elevationMils: 1296, timeToImpactSeconds: 16.1 },
              { range: 300, elevationMils: 1251, timeToImpactSeconds: 15.9 },
              { range: 350, elevationMils: 1203, timeToImpactSeconds: 15.7 },
              { range: 400, elevationMils: 1151, timeToImpactSeconds: 15.4 },
              { range: 450, elevationMils: 1093, timeToImpactSeconds: 15.0 },
              { range: 500, elevationMils: 1028, timeToImpactSeconds: 14.5 },
              { range: 550, elevationMils: 945, timeToImpactSeconds: 13.8 },
              { range: 600, elevationMils: 799, timeToImpactSeconds: 12.3 }
            ],
            // Ring 2
            [
              { range: 200, elevationMils: 1417, timeToImpactSeconds: 23.6 },
              { range: 300, elevationMils: 1374, timeToImpactSeconds: 23.5 },
              { range: 400, elevationMils: 1330, timeToImpactSeconds: 23.3 },
              { range: 500, elevationMils: 1284 , timeToImpactSeconds: 23.1 },
              { range: 600, elevationMils: 1234, timeToImpactSeconds: 22.8 },
              { range: 700, elevationMils: 1182, timeToImpactSeconds: 22.4 },
              { range: 800, elevationMils: 1124, timeToImpactSeconds: 21.9 },
              { range: 900, elevationMils: 1057, timeToImpactSeconds: 21.3 },
              { range: 1000, elevationMils: 979, timeToImpactSeconds: 20.4 },
              { range: 1100, elevationMils: 870, timeToImpactSeconds: 18.9 }
            ],
            // Ring 3
            [
              { range: 300,  elevationMils: 1411, timeToImpactSeconds: 29.0 },
              { range: 400,  elevationMils: 1380, timeToImpactSeconds: 28.9 },
              { range: 500,  elevationMils: 1348, timeToImpactSeconds: 28.7 },
              { range: 600,  elevationMils: 1315, timeToImpactSeconds: 28.6 },
              { range: 700,  elevationMils: 1281, timeToImpactSeconds: 28.4 },
              { range: 800,  elevationMils: 1246, timeToImpactSeconds: 28.1 },
              { range: 900,  elevationMils: 1209, timeToImpactSeconds: 27.8 },
              { range: 1000, elevationMils: 1170, timeToImpactSeconds: 27.4 },
              { range: 1100, elevationMils: 1128, timeToImpactSeconds: 27.0 },
              { range: 1200, elevationMils: 1082, timeToImpactSeconds: 26.5 },
              { range: 1300, elevationMils: 1031, timeToImpactSeconds: 25.8 },
              { range: 1400, elevationMils: 973, timeToImpactSeconds: 25.0 },
              { range: 1500, elevationMils: 903, timeToImpactSeconds: 23.9 },
              { range: 1600, elevationMils: 807, timeToImpactSeconds: 22.3 }
            ],
            // Ring 4
            [
              { range: 400,  elevationMils: 1411, timeToImpactSeconds: 35.3 },
              { range: 500,  elevationMils: 1388, timeToImpactSeconds: 35.2 },
              { range: 600,  elevationMils: 1364, timeToImpactSeconds: 35.1 },
              { range: 700,  elevationMils: 1341, timeToImpactSeconds: 35.0 },
              { range: 800,  elevationMils: 1316, timeToImpactSeconds: 34.8 },
              { range: 900,  elevationMils: 1291, timeToImpactSeconds: 34.7 },
              { range: 1000, elevationMils: 1265, timeToImpactSeconds: 34.4 },
              { range: 1100, elevationMils: 1238, timeToImpactSeconds: 34.2 },
              { range: 1200, elevationMils: 1210, timeToImpactSeconds: 33.9 },
              { range: 1300, elevationMils: 1181, timeToImpactSeconds: 33.6 },
              { range: 1400, elevationMils: 1150, timeToImpactSeconds: 33.2 },
              { range: 1500, elevationMils: 1119, timeToImpactSeconds: 32.8 },
              { range: 1600, elevationMils: 1085, timeToImpactSeconds: 32.4 },
              { range: 1700, elevationMils: 1048, timeToImpactSeconds: 31.8 },
              { range: 1800, elevationMils: 1009, timeToImpactSeconds: 31.2 },
              { range: 1900, elevationMils: 965, timeToImpactSeconds: 30.4 },
              { range: 2000, elevationMils: 917, timeToImpactSeconds: 29.6 },
              { range: 2100, elevationMils: 860, timeToImpactSeconds: 28.4 },
              { range: 2200, elevationMils: 787, timeToImpactSeconds: 26.9 }
            ]
          ]
        }
      }
    ]
  },
  {
    name: "82mm Mortar",
    ammo: [
      {
        name: "HE Shell",
        minRange: 50,
        maxRange: 2900,
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
              { range: 50,  elevationMils: 1540, timeToImpactSeconds: 13.2 },
              { range: 100, elevationMils: 1479, timeToImpactSeconds: 13.2 },
              { range: 150, elevationMils: 1416, timeToImpactSeconds: 13.0 },
              { range: 200, elevationMils: 1350, timeToImpactSeconds: 12.8 },
              { range: 250, elevationMils: 1279, timeToImpactSeconds: 12.6 },
              { range: 300, elevationMils: 1201, timeToImpactSeconds: 12.3 },
              { range: 350, elevationMils: 1106, timeToImpactSeconds: 11.7 },
              { range: 400, elevationMils:  955, timeToImpactSeconds: 10.7 },
            ],
            // Ring 1
            [
              { range: 100, elevationMils: 1547, timeToImpactSeconds: 20.0 },
              { range: 200, elevationMils: 1492, timeToImpactSeconds: 19.9 },
              { range: 300, elevationMils: 1437, timeToImpactSeconds: 19.7 },
              { range: 400, elevationMils: 1378, timeToImpactSeconds: 19.5 },
              { range: 500, elevationMils: 1317, timeToImpactSeconds: 19.2 },
              { range: 600, elevationMils: 1249, timeToImpactSeconds: 18.8 },
              { range: 700, elevationMils: 1174, timeToImpactSeconds: 18.3 },
              { range: 800, elevationMils: 1085, timeToImpactSeconds: 17.5 },
              { range: 900, elevationMils: 954, timeToImpactSeconds: 16.1  },
            ],
            // Ring 2
            [
              { range: 200,  elevationMils: 1538, timeToImpactSeconds: 26.6 },
              { range: 300,  elevationMils: 1507, timeToImpactSeconds: 26.5 },
              { range: 400,  elevationMils: 1475, timeToImpactSeconds: 26.4 },
              { range: 500,  elevationMils: 1443, timeToImpactSeconds: 26.3 },
              { range: 600,  elevationMils: 1410, timeToImpactSeconds: 26.2 },
              { range: 700,  elevationMils: 1376, timeToImpactSeconds: 26.0 },
              { range: 800,  elevationMils: 1341, timeToImpactSeconds: 25.8 },
              { range: 900,  elevationMils: 1305, timeToImpactSeconds: 25.5 },
              { range: 1000, elevationMils: 1266, timeToImpactSeconds: 25.2 },
              { range: 1100, elevationMils: 1225, timeToImpactSeconds: 24.9 },
              { range: 1200, elevationMils: 1180, timeToImpactSeconds: 24.4 },
              { range: 1300, elevationMils: 1132, timeToImpactSeconds: 23.9 },
              { range: 1400, elevationMils: 1076, timeToImpactSeconds: 23.2 },
              { range: 1500, elevationMils: 1009, timeToImpactSeconds: 22.3 },
              { range: 1600, elevationMils:  912, timeToImpactSeconds: 20.9 },
            ],
            // Ring 3
            [
              { range: 300,  elevationMils: 1534, timeToImpactSeconds: 31.7 },
              { range: 400,  elevationMils: 1511, timeToImpactSeconds: 31.6 },
              { range: 500,  elevationMils: 1489, timeToImpactSeconds: 31.6 },
              { range: 600,  elevationMils: 1466, timeToImpactSeconds: 31.5 },
              { range: 700,  elevationMils: 1442, timeToImpactSeconds: 31.4 },
              { range: 800,  elevationMils: 1419, timeToImpactSeconds: 31.3 },
              { range: 900,  elevationMils: 1395, timeToImpactSeconds: 31.1 },
              { range: 1000, elevationMils: 1370, timeToImpactSeconds: 31.0 },
              { range: 1100, elevationMils: 1344, timeToImpactSeconds: 30.8 },
              { range: 1200, elevationMils: 1318, timeToImpactSeconds: 30.6 },
              { range: 1300, elevationMils: 1291, timeToImpactSeconds: 30.3 },
              { range: 1400, elevationMils: 1263, timeToImpactSeconds: 30.1 },
              { range: 1500, elevationMils: 1233, timeToImpactSeconds: 29.7 },
              { range: 1600, elevationMils: 1202, timeToImpactSeconds: 29.4 },
              { range: 1700, elevationMils: 1169, timeToImpactSeconds: 29.0 },
              { range: 1800, elevationMils: 1133, timeToImpactSeconds: 28.5 },
              { range: 1900, elevationMils: 1094, timeToImpactSeconds: 28.0 },
              { range: 2000, elevationMils: 1051, timeToImpactSeconds: 27.3 },
              { range: 2100, elevationMils:  999, timeToImpactSeconds: 26.5 },
              { range: 2200, elevationMils:  931, timeToImpactSeconds: 25.3 },
              { range: 2300, elevationMils:  801, timeToImpactSeconds: 22.7 },
            ],
            // Ring 4
            [
              { range: 400,  elevationMils: 1531, timeToImpactSeconds: 36.3 },
              { range: 500,  elevationMils: 1514, timeToImpactSeconds: 36.2 },
              { range: 600,  elevationMils: 1496, timeToImpactSeconds: 36.2 },
              { range: 700,  elevationMils: 1478, timeToImpactSeconds: 36.1 },
              { range: 800,  elevationMils: 1460, timeToImpactSeconds: 36.0 },
              { range: 900,  elevationMils: 1442, timeToImpactSeconds: 35.9 },
              { range: 1000, elevationMils: 1424, timeToImpactSeconds: 35.8 },
              { range: 1100, elevationMils: 1405, timeToImpactSeconds: 35.7 },
              { range: 1200, elevationMils: 1385, timeToImpactSeconds: 35.6 },
              { range: 1300, elevationMils: 1365, timeToImpactSeconds: 35.4 },
              { range: 1400, elevationMils: 1346, timeToImpactSeconds: 35.3 },
              { range: 1500, elevationMils: 1325, timeToImpactSeconds: 35.1 },
              { range: 1600, elevationMils: 1305, timeToImpactSeconds: 34.9 },
              { range: 1700, elevationMils: 1283, timeToImpactSeconds: 34.6 },
              { range: 1800, elevationMils: 1261, timeToImpactSeconds: 34.6 },
              { range: 1900, elevationMils: 1238, timeToImpactSeconds: 34.4 },
              { range: 2000, elevationMils: 1214, timeToImpactSeconds: 33.8 },
              { range: 2100, elevationMils: 1118, timeToImpactSeconds: 33.5 },
              { range: 2200, elevationMils: 1162, timeToImpactSeconds: 33.1 },
              { range: 2300, elevationMils: 1134, timeToImpactSeconds: 32.7 },
              { range: 2400, elevationMils: 1104, timeToImpactSeconds: 32.2 },
              { range: 2500, elevationMils: 1070, timeToImpactSeconds: 31.7 },
              { range: 2600, elevationMils: 1034, timeToImpactSeconds: 31.0 },
              { range: 2700, elevationMils:  993, timeToImpactSeconds: 30.3 },
              { range: 2800, elevationMils:  942, timeToImpactSeconds: 29.2 },
              { range: 2900, elevationMils:  870, timeToImpactSeconds: 27.7 },
            ]
          ]
        }
      },
      {
        name: "Smoke Shell",
        minRange: 100,
        maxRange: 1800,
        ballistics: {
          rings: [
            // Ring 1 (outermost)
            [
              { range: 200, elevationMils: 1463, timeToImpactSeconds: 17.7 },
              { range: 250, elevationMils: 1427, timeToImpactSeconds: 17.6 },
              { range: 300, elevationMils: 1391, timeToImpactSeconds: 17.5 },
              { range: 350, elevationMils: 1352, timeToImpactSeconds: 17.3 },
              { range: 400, elevationMils: 1314, timeToImpactSeconds: 17.2 },
              { range: 450, elevationMils: 1271, timeToImpactSeconds: 16.9 },
              { range: 500, elevationMils: 1227, timeToImpactSeconds: 16.7 },
              { range: 550, elevationMils: 1178, timeToImpactSeconds: 16.4 },
              { range: 600, elevationMils: 1124, timeToImpactSeconds: 16.0 },
              { range: 650, elevationMils: 1060, timeToImpactSeconds: 15.4 },
              { range: 700, elevationMils: 982, timeToImpactSeconds: 14.7 },
              { range: 750, elevationMils: 822, timeToImpactSeconds: 13.0 }
            ],
            // Ring 2
            [
              { range: 200, elevationMils: 1528, timeToImpactSeconds: 24.8 },
              { range: 300, elevationMils: 1491, timeToImpactSeconds: 24.7 },
              { range: 400, elevationMils: 1453, timeToImpactSeconds: 24.6 },
              { range: 500, elevationMils: 1414, timeToImpactSeconds: 24.4 }, 
              { range: 600, elevationMils: 1333, timeToImpactSeconds: 24.2 }, 
              { range: 700, elevationMils: 1414, timeToImpactSeconds: 24.0 }, 
              { range: 800, elevationMils: 1289, timeToImpactSeconds: 23.7 }, 
              { range: 900, elevationMils: 1242, timeToImpactSeconds: 23.3 }, 
              { range: 1000, elevationMils: 1191, timeToImpactSeconds: 22.9 }, 
              { range: 1100, elevationMils: 1133, timeToImpactSeconds: 22.3 }, 
              { range: 1200, elevationMils: 1067, timeToImpactSeconds: 21.6 }, 
              { range: 1300, elevationMils: 980, timeToImpactSeconds: 20.5 }, 
              { range: 1400, elevationMils: 818, timeToImpactSeconds: 18.0 }
            ],
            // Ring 3
            [
              { range: 300, elevationMils: 853, timeToImpactSeconds: 29.6 },
              { range: 400, elevationMils: 1031, timeToImpactSeconds: 29.6 },
              { range: 500, elevationMils: 1316, timeToImpactSeconds: 29.5 },
              { range: 600, elevationMils: 1564, timeToImpactSeconds: 29.3 },
              { range: 700, elevationMils: 1412, timeToImpactSeconds: 29.2 }, 
              { range: 800, elevationMils: 1383, timeToImpactSeconds: 29.0 }, 
              { range: 900, elevationMils: 1354, timeToImpactSeconds: 28.9 }, 
              { range: 1000, elevationMils: 1323, timeToImpactSeconds: 28.6 }, 
              { range: 1100, elevationMils: 1291, timeToImpactSeconds: 28.4 }, 
              { range: 1200, elevationMils: 1257, timeToImpactSeconds: 28.1 }, 
              { range: 1300, elevationMils: 1221, timeToImpactSeconds: 27.7 }, 
              { range: 1400, elevationMils: 1183, timeToImpactSeconds: 27.3 }, 
              { range: 1500, elevationMils: 1142, timeToImpactSeconds: 26.8 },
              { range: 1600, elevationMils: 1096, timeToImpactSeconds: 26.2 },
              { range: 1700, elevationMils: 1044, timeToImpactSeconds: 25.5 }, 
              { range: 1800, elevationMils: 980, timeToImpactSeconds: 24.5 }, 
              { range: 1900, elevationMils: 892, timeToImpactSeconds: 23.0 } 
            ],
            // Ring 4
            [
              { range: 400, elevationMils: 907, timeToImpactSeconds: 33.6 },
              { range: 500, elevationMils: 1084, timeToImpactSeconds: 33.5 },
              { range: 600, elevationMils: 1369, timeToImpactSeconds: 33.5 },
              { range: 700, elevationMils: 1618, timeToImpactSeconds: 33.4 }, 
              { range: 800, elevationMils: 1429, timeToImpactSeconds: 33.2 },
              { range: 900, elevationMils: 1407, timeToImpactSeconds: 33.1 }, 
              { range: 1000, elevationMils: 1383, timeToImpactSeconds: 33.0 }, 
              { range: 1100, elevationMils: 1360, timeToImpactSeconds: 32.8 }, 
              { range: 1200, elevationMils: 1335, timeToImpactSeconds: 32.6 },
              { range: 1300, elevationMils: 1310, timeToImpactSeconds: 32.4 },
              { range: 1400, elevationMils: 1284, timeToImpactSeconds: 32.1 },
              { range: 1500, elevationMils: 1257, timeToImpactSeconds: 31.9 },
              { range: 1600, elevationMils: 1228, timeToImpactSeconds: 31.5 },
              { range: 1700, elevationMils: 1199, timeToImpactSeconds: 31.2 }, 
              { range: 1800, elevationMils: 1166, timeToImpactSeconds: 30.8 }, 
              { range: 1900, elevationMils: 1132, timeToImpactSeconds: 30.3 }, 
              { range: 2000, elevationMils: 1096, timeToImpactSeconds: 29.8 }, 
              { range: 2100, elevationMils: 1055, timeToImpactSeconds: 29.1 }, 
              { range: 2200, elevationMils: 1008, timeToImpactSeconds: 28.4 },
              { range: 2300, elevationMils: 952, timeToImpactSeconds: 27.4 }, 
              { range: 2400, elevationMils: 871, timeToImpactSeconds: 25.8 }
            ]
          ]
        }
      }
    ]
  }
]; 