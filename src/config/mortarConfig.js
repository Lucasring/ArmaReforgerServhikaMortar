export const MAP_SCALE_METERS_PER_PIXEL = (0.43588888888) / 1.007;

export const mortarTypes = [
  {
    name: "2B-14 Mortar",
    ammo: [
      {
        name: "HE Shell",
        minRange: 50,
        maxRange: 1500,
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
              { range: 50,  elevationMils: 1455 },
              { range: 100, elevationMils: 1411 },
              { range: 150, elevationMils: 1365 },
              { range: 200, elevationMils: 1318 },
              { range: 250, elevationMils: 1268 },
              { range: 300, elevationMils: 1217 },
              { range: 350, elevationMils: 1159 },
              { range: 400, elevationMils: 1095 },
              { range: 450, elevationMils: 1023 },
              { range: 500, elevationMils: 922 }
            ],
            // Ring 1
            [
              { range: 100, elevationMils: 1446 },
              { range: 200, elevationMils: 1392 },
              { range: 300, elevationMils: 1335 },
              { range: 400, elevationMils: 1275 },
              { range: 500, elevationMils: 1212 },
              { range: 600, elevationMils: 1141 },
              { range: 700, elevationMils: 1058 },
              { range: 800, elevationMils: 952 }
            ],
            // Ring 2
            [
              { range: 200, elevationMils: 1432 },
              { range: 300, elevationMils: 1397 },
              { range: 400, elevationMils: 1362 },
              { range: 500, elevationMils: 1325 },
              { range: 600, elevationMils: 1288 },
              { range: 700, elevationMils: 1248 },
              { range: 800, elevationMils: 1207 },
              { range: 900, elevationMils: 1162 },
              { range: 1000, elevationMils: 1114 },
              { range: 1100, elevationMils: 1060 },
              { range: 1200, elevationMils: 997 },
              { range: 1300, elevationMils: 914 },
              { range: 1400, elevationMils: 755 }
            ],
            // Ring 3
            [
              { range: 300,  elevationMils: 1423 },
              { range: 400,  elevationMils: 1397 },
              { range: 500,  elevationMils: 1370 },
              { range: 600,  elevationMils: 1343 },
              { range: 700,  elevationMils: 1315 },
              { range: 800,  elevationMils: 1286 },
              { range: 900,  elevationMils: 1257 },
              { range: 1000, elevationMils: 1226 },
              { range: 1100, elevationMils: 1193 },
              { range: 1200, elevationMils: 1159 },
              { range: 1300, elevationMils: 1123 },
              { range: 1400, elevationMils: 1084 },
              { range: 1500, elevationMils: 1040 },
              { range: 1600, elevationMils: 991 },
              { range: 1700, elevationMils: 932 },
              { range: 1800, elevationMils: 851 }
            ],
            // Ring 4
            [
              { range: 400,  elevationMils: 1418 },
              { range: 500,  elevationMils: 1398 },
              { range: 600,  elevationMils: 1376 },
              { range: 700,  elevationMils: 1355 },
              { range: 800,  elevationMils: 1333 },
              { range: 900,  elevationMils: 1311 },
              { range: 1000, elevationMils: 1288 },
              { range: 1100, elevationMils: 1264 },
              { range: 1200, elevationMils: 1240 },
              { range: 1300, elevationMils: 1215 },
              { range: 1400, elevationMils: 1189 },
              { range: 1500, elevationMils: 1161 },
              { range: 1600, elevationMils: 1133 },
              { range: 1700, elevationMils: 1102 },
              { range: 1800, elevationMils: 1069 },
              { range: 1900, elevationMils: 1034 },
              { range: 2000, elevationMils: 995 },
              { range: 2100, elevationMils: 950 },
              { range: 2200, elevationMils: 896 },
              { range: 2300, elevationMils: 820 }
            ]            
          ]
        }
      },
      {
        name: "Smoke Shell",
        minRange: 50,
        maxRange: 1500,
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
              { range: 50, elevationMils: 1450 },
              { range: 100, elevationMils: 1399 },
              { range: 150, elevationMils: 1347 },
              { range: 200, elevationMils: 1292 },
              { range: 250, elevationMils: 1235 },
              { range: 300, elevationMils: 1172},
              { range: 350, elevationMils: 1102 },
              { range: 400, elevationMils: 1020 },
              { range: 450, elevationMils: 898 }
            ],
            // Ring 1
            [
              { range: 200, elevationMils: 1381 },
              { range: 300, elevationMils: 1319 },
              { range: 400, elevationMils: 1252 },
              { range: 500, elevationMils: 1179 },
              { range: 600, elevationMils: 1097 },
              { range: 700, elevationMils: 993 },
              { range: 800, elevationMils: 805 }
            ],
            // Ring 2
            [
              { range: 300,  elevationMils: 1387 },
              { range: 400,  elevationMils: 1348 },
              { range: 500,  elevationMils: 1308 },
              { range: 600,  elevationMils: 1266 },
              { range: 700,  elevationMils: 1222 },
              { range: 800,  elevationMils: 1175 },
              { range: 900,  elevationMils: 1123 },
              { range: 1000, elevationMils: 1065 },
              { range: 1100, elevationMils: 994 },
              { range: 1200, elevationMils: 902 }
            ],
            // Ring 3
            [
              { range: 400,  elevationMils: 1387 },
              { range: 500,  elevationMils: 1357 },
              { range: 600,  elevationMils: 1327 },
              { range: 700,  elevationMils: 1296 },
              { range: 800,  elevationMils: 1264 },
              { range: 900,  elevationMils: 1231 },
              { range: 1000, elevationMils: 1196 },
              { range: 1100, elevationMils: 1159 },
              { range: 1200, elevationMils: 1119 },
              { range: 1300, elevationMils: 1075 },
              { range: 1400, elevationMils: 1026 },
              { range: 1500, elevationMils: 969 },
              { range: 1600, elevationMils: 896 },
              { range: 1700, elevationMils: 753 }
            ]
          ]
        }
      },
      {
        name: "Flare Shell",
        minRange: 50,
        maxRange: 1500,
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
              { range: 100, elevationMils: 1421 },
              { range: 150, elevationMils: 1381 },
              { range: 200, elevationMils: 1339 },
              { range: 250, elevationMils: 1296 },
              { range: 300, elevationMils: 1251 },
              { range: 350, elevationMils: 1203 },
              { range: 400, elevationMils: 1151 },
              { range: 450, elevationMils: 1093 },
              { range: 500, elevationMils: 1028 },
              { range: 550, elevationMils: 945 },
              { range: 600, elevationMils: 799 }
            ],
            // Ring 2
            [
              { range: 200, elevationMils: 1417 },
              { range: 300, elevationMils: 1374 },
              { range: 400, elevationMils: 1330 },
              { range: 500, elevationMils: 1284 },
              { range: 600, elevationMils: 1234 },
              { range: 700, elevationMils: 1182 },
              { range: 800, elevationMils: 1124 },
              { range: 900, elevationMils: 1057 },
              { range: 1000, elevationMils: 979 },
              { range: 1100, elevationMils: 870 }
            ],
            // Ring 3
            [
              { range: 300,  elevationMils: 1411 },
              { range: 400,  elevationMils: 1380 },
              { range: 500,  elevationMils: 1348 },
              { range: 600,  elevationMils: 1315 },
              { range: 700,  elevationMils: 1281 },
              { range: 800,  elevationMils: 1246 },
              { range: 900,  elevationMils: 1209 },
              { range: 1000, elevationMils: 1170 },
              { range: 1100, elevationMils: 1128 },
              { range: 1200, elevationMils: 1082 },
              { range: 1300, elevationMils: 1031 },
              { range: 1400, elevationMils: 973 },
              { range: 1500, elevationMils: 903 },
              { range: 1600, elevationMils: 807 }
            ],
            // Ring 4
            [
              { range: 400,  elevationMils: 1411 },
              { range: 500,  elevationMils: 1388 },
              { range: 600,  elevationMils: 1364 },
              { range: 700,  elevationMils: 1341 },
              { range: 800,  elevationMils: 1316 },
              { range: 900,  elevationMils: 1291 },
              { range: 1000, elevationMils: 1265 },
              { range: 1100, elevationMils: 1238 },
              { range: 1200, elevationMils: 1210 },
              { range: 1300, elevationMils: 1181 },
              { range: 1400, elevationMils: 1150 },
              { range: 1500, elevationMils: 1119 },
              { range: 1600, elevationMils: 1085 },
              { range: 1700, elevationMils: 1048 },
              { range: 1800, elevationMils: 1009 },
              { range: 1900, elevationMils: 965 },
              { range: 2000, elevationMils: 860 },
              { range: 2200, elevationMils: 787 }
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
        minRange: 100,
        maxRange: 2000,
        ballistics: {
          // Each ring contains an array of range/elevation pairs
          rings: [
            // Ring 1 (outermost)
            [
              { range: 2000, elevationMils: 800 },
              { range: 1500, elevationMils: 978 },
              { range: 1000, elevationMils: 1244 },
              { range: 500, elevationMils: 1511 }
            ],
            // Ring 2
            [
              { range: 2000, elevationMils: 853 },
              { range: 1500, elevationMils: 1031 },
              { range: 1000, elevationMils: 1298 },
              { range: 500, elevationMils: 1564 }
            ],
            // Ring 3
            [
              { range: 2000, elevationMils: 907 },
              { range: 1500, elevationMils: 1084 },
              { range: 1000, elevationMils: 1351 },
              { range: 500, elevationMils: 1618 }
            ],
            // Ring 4
            [
              { range: 400, elevationMils: 1531 },
              { range: 500, elevationMils: 1514 },
              { range: 600, elevationMils: 1496 },
              { range: 700, elevationMils: 1478 },
              { range: 800, elevationMils: 1460 },
              { range: 900, elevationMils: 1442 },
              { range: 1000, elevationMils: 1424 },
              { range: 1100, elevationMils: 1405 },
              { range: 1200, elevationMils: 1385 },
              { range: 1300, elevationMils: 1366 },
              { range: 1400, elevationMils: 1346 },
              { range: 1500, elevationMils: 1326 },
              { range: 1600, elevationMils: 1305 },
              { range: 1700, elevationMils: 1283 },
              { range: 1800, elevationMils: 1261 },
              { range: 1900, elevationMils: 1238 },
              { range: 2000, elevationMils: 1214 },
              { range: 2100, elevationMils: 1188 },
              { range: 2200, elevationMils: 1162 },
              { range: 2300, elevationMils: 1134 },
              { range: 2400, elevationMils: 1104 },
              { range: 2500, elevationMils: 1070 },
              { range: 2600, elevationMils: 1034 },
              { range: 2700, elevationMils: 993 },
              { range: 2800, elevationMils: 942 },
              { range: 2900, elevationMils: 870 }
            ],
            // Ring 5
            [
              { range: 2000, elevationMils: 1013 },
              { range: 1500, elevationMils: 1190 },
              { range: 1000, elevationMils: 1458 },
              { range: 500, elevationMils: 1724 }
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
              { range: 1800, elevationMils: 747 },
              { range: 1500, elevationMils: 924 },
              { range: 1000, elevationMils: 1209 },
              { range: 500, elevationMils: 1458 }
            ],
            // Ring 2
            [
              { range: 1800, elevationMils: 800 },
              { range: 1500, elevationMils: 978 },
              { range: 1000, elevationMils: 1262 },
              { range: 500, elevationMils: 1511 }
            ],
            // Ring 3
            [
              { range: 1800, elevationMils: 853 },
              { range: 1500, elevationMils: 1031 },
              { range: 1000, elevationMils: 1316 },
              { range: 500, elevationMils: 1564 }
            ],
            // Ring 4
            [
              { range: 1800, elevationMils: 907 },
              { range: 1500, elevationMils: 1084 },
              { range: 1000, elevationMils: 1369 },
              { range: 500, elevationMils: 1618 }
            ]
          ]
        }
      }
    ]
  }
]; 