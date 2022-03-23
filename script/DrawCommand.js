function getIndex(point, canvas) {
    return 4 * (point.x + (point.y * canvas.width));
}

function isInsideCanvas(point, canvas) {
    return point.x >= 0 && point.x < canvas.width && point.y >= 0 && point.y < canvas.height;
}

function drawDot(imageData, coordinate, color, canvas) {
    var index = getIndex(coordinate, canvas);
    if (isInsideCanvas(coordinate, canvas)) {
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = color.a;
    }
}

function drawDots(imageData, coordinates, color, canvas) {
    coordinates.forEach(coordinate => { drawDot(imageData, coordinate, color, canvas) });
}

function ddaLine(imageData, coordinate1, coordinate2, color, canvas) {
    var x1 = coordinate1.x;
    var y1 = coordinate1.y;
    var x2 = coordinate2.x;
    var y2 = coordinate2.y;

    var dx = x2 - x1;
    var dy = y2 - y1;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (x2 > x1) {
            var y = y1;
            for (var x = x1; x < x2; x++) {
                y = y + dy / Math.abs(dx);
                drawDot(imageData, { x: x, y: y }, color, canvas);
            }
        } else {
            var y = y1;
            for (var x = x1; x > x2; x--) {
                y = y + dy / Math.abs(dx);
                drawDot(imageData, { x: x, y: y }, color, canvas);
            }
        }
    } else {
        if (y2 > y1) {
            var x = x1;
            for (var y = y1; y < y2; y++) {
                x = x + dx / Math.abs(dy);
                drawDot(imageData, { x: x, y: y }, color, canvas);
            }
        } else {
            var x = x1;
            for (var y = y1; y > y2; y--) {
                x = x + dx / Math.abs(dy);
                drawDot(imageData, { x: x, y: y }, color, canvas);
            }
        }
    }
}

function garis(img, coordinate1, coordinate2, color, canvas) {
    var x1 = coordinate1.x;
    var y1 = coordinate1.y;
    var x2 = coordinate2.x;
    var y2 = coordinate2.y;

    if (Math.abs(x2 - x1) == 0 || Math.abs(y2 - y1) == 0) {
        m = 0
    }
    else {
        m = Math.abs(x2 - x1) / Math.abs(y2 - y1)
    }
    x = x1
    y = y1
    while ((Math.round(x) != x2) || (Math.round(y) != y2)) {
        drawDot(img, { x: Math.round(x), y: Math.round(y) }, color, canvas);
        if (m == 0 || m == 1) {
            if (x < x2) {
                x += 1
            }
            else if (x > x2) {
                x -= 1
            }
            if (y < y2) {
                y += 1
            }
            else if (y > y2) {
                y -= 1
            }
        }
        else {
            if (m < 1) {
                if (x < x2) {
                    x += m
                }
                else if (x > x2) {
                    x -= m
                }
                if (y < y2) {
                    y += 1
                }
                else if (y > y2) {
                    y -= 1
                }
            }
            else {
                if (x < x2) {
                    x += 1
                }
                else if (x > x2) {
                    x -= 1
                }
                if (y < y2) {
                    y += 1 / m
                }
                else if (y > y2) {
                    y -= 1 / m
                }
            }
        }
    }
}

function drawPolyline(imageData, coordinates, color, canvas) {
    var tempCoordinate = coordinates.shift();

    coordinates.forEach(element => {
        garis(imageData, tempCoordinate, element, color, canvas);
        tempCoordinate = element;
    });
}

function drawPolygon(imageData, coordinates, color, canvas) {
    var tempCoordinate = coordinates[0];

    for (var index = 1; index < coordinates.length; index++) {
        garis(imageData, tempCoordinate, coordinates[index], color, canvas)
        tempCoordinate = coordinates[index];
    };
    garis(imageData, tempCoordinate, coordinates[0], color, canvas)
}

function drawPolygonFixed(imageData, coordinateCenter, radius, vertices, rotate, color, canvas) {
    var angle = Math.PI * 2 / vertices;
    var coordinates = [];

    for (var x = 0; x < vertices; x++) {
        var coX = radius * Math.sin(angle * x);
        var coY = -radius * Math.cos(angle * x);
        coordinates.push(rotationFixed({ x: Math.round(coX + coordinateCenter.x), y: Math.round(coY + coordinateCenter.y) }, coordinateCenter, degToRad(rotate)));
    }
    drawPolygon(imageData, coordinates, color, canvas);
}


function drawSimpleCircle(imageData, center, radius, color, canvas) {
    for (var x = center.x - radius; x <= center.x + radius; x++) {
        var root = Math.sqrt(Math.pow(radius, 2) - Math.pow(x - center.x, 2));
        drawDot(imageData, { x: x, y: Math.round(center.y + root) }, color, canvas);
        drawDot(imageData, { x: x, y: Math.round(center.y - root) }, color, canvas);
    }

}

function drawSimpleFullCircle(imageData, center, radius, color, canvas) {
    for (var rad = radius; rad > 0; rad--) {
        for (var x = center.x - rad; x <= center.x + rad; x++) {
            var root = Math.sqrt(Math.pow(rad, 2) - Math.pow(x - center.x, 2));
            drawDot(imageData, { x: x, y: Math.round(center.y + root) }, color, canvas);
            drawDot(imageData, { x: x, y: Math.round(center.y - root) }, color, canvas);
        }
    }
    drawDot(imageData, center, color, canvas);

}

function drawCircle(imageData, center, radius, color, canvas) {
    for (var x = 0; x <= 0.25 * Math.PI; x += 1 / (2 * radius)) {
        var dx = radius * Math.cos(x);
        var dy = radius * Math.sin(x);

        drawDot(imageData, { x: Math.round(center.x + dx), y: Math.round(center.y + dy) }, color, canvas);
        drawDot(imageData, { x: Math.round(center.x - dx), y: Math.round(center.y + dy) }, color, canvas);
        drawDot(imageData, { x: Math.round(center.x + dx), y: Math.round(center.y - dy) }, color, canvas);
        drawDot(imageData, { x: Math.round(center.x - dx), y: Math.round(center.y - dy) }, color, canvas);
        drawDot(imageData, { x: Math.round(center.x + dy), y: Math.round(center.y + dx) }, color, canvas);
        drawDot(imageData, { x: Math.round(center.x - dy), y: Math.round(center.y + dx) }, color, canvas);
        drawDot(imageData, { x: Math.round(center.x + dy), y: Math.round(center.y - dx) }, color, canvas);
        drawDot(imageData, { x: Math.round(center.x - dy), y: Math.round(center.y - dx) }, color, canvas);
    }
}

function drawFullCircle(imageData, center, radius, color, canvas) {
    for (var rad = radius; rad > 0; rad--) {
        for (var x = 0; x <= 0.25 * Math.PI; x += 1 / (2 * rad)) {
            var dx = rad * Math.cos(x);
            var dy = rad * Math.sin(x);

            drawDot(imageData, { x: Math.round(center.x + dx), y: Math.round(center.y + dy) }, color, canvas);
            drawDot(imageData, { x: Math.round(center.x - dx), y: Math.round(center.y + dy) }, color, canvas);
            drawDot(imageData, { x: Math.round(center.x + dx), y: Math.round(center.y - dy) }, color, canvas);
            drawDot(imageData, { x: Math.round(center.x - dx), y: Math.round(center.y - dy) }, color, canvas);
            drawDot(imageData, { x: Math.round(center.x + dy), y: Math.round(center.y + dx) }, color, canvas);
            drawDot(imageData, { x: Math.round(center.x - dy), y: Math.round(center.y + dx) }, color, canvas);
            drawDot(imageData, { x: Math.round(center.x + dy), y: Math.round(center.y - dx) }, color, canvas);
            drawDot(imageData, { x: Math.round(center.x - dy), y: Math.round(center.y - dx) }, color, canvas);
        }
    }
    drawDot(imageData, center, color, canvas);
}


function drawEllipse(imageData, center, radiusX, radiusY, color, canvas) {
    for (var x = 0; x < Math.PI * 2; x += 0.01) {
        var dx = center.x + radiusX * Math.cos(x);
        var dy = center.y + radiusY * Math.sin(x);

        drawDot(imageData, { x: Math.ceil(dx), y: Math.ceil(dy) }, color, canvas);
    }
}

function drawLeaf(imageData, center, radius, numOfLeaf, color, canvas) {
    for (var x = 0; x < Math.PI * 2; x += 0.01) {
        var dx = center.x + radius * Math.cos(numOfLeaf * x) * Math.cos(x);
        var dy = center.y + radius * Math.cos(numOfLeaf * x) * Math.sin(x);

        drawDot(imageData, { x: Math.ceil(dx), y: Math.ceil(dy) }, color, canvas);
    }
}

function drawSpiral(imageData, center, radius, color, canvas) {
    for (var x = 0; x < Math.PI * 6; x += 0.01) {
        newRadius = radius * x;
        var dx = center.x + newRadius * Math.cos(x);
        var dy = center.y + newRadius * Math.sin(x);

        drawDot(imageData, { x: Math.ceil(dx), y: Math.ceil(dy) }, color, canvas);
    }
}

function drawcardioid(imageData, center, radius, color, canvas) {
    for (var x = 0; x <= Math.PI * 2; x += 0.01) {
        var dx = center.x + (radius + radius * Math.sin(x)) * Math.cos(x);
        var dy = center.y + (radius + radius * Math.sin(x)) * Math.sin(x);

        drawDot(imageData, { x: Math.ceil(dx), y: Math.ceil(dy) }, color, canvas);
    }
}

function drawGear(imageData, center, radius, color, canvas) {
    var o = 0;
    for (var x = 0; x <= Math.PI * 2; x += 1 / radius) {
        var dx = center.x + (radius - 20 * Math.sin(o)) * Math.cos(x);
        var dy = center.y + (radius - 20 * Math.sin(o)) * Math.sin(x);
        o += 30 / radius;

        drawDot(imageData, { x: Math.ceil(dx), y: Math.ceil(dy) }, color, canvas);
    }
}

function floodFillNaive(imageData, coordinate, toFlood, color, canvas) {
    var index = getIndex(coordinate, canvas);

    var r = imageData.data[index];
    var g = imageData.data[index + 1];
    var b = imageData.data[index + 2];

    if (r == toFlood.r && g == toFlood.g && b == toFlood.b) {
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = color.a;

        floodFillNaive(imageData, { x: coordinate.x + 1, y: coordinate.y }, toFlood, color, canvas);
        floodFillNaive(imageData, { x: coordinate.x - 1, y: coordinate.y }, toFlood, color, canvas);
        floodFillNaive(imageData, { x: coordinate.x, y: coordinate.y + 1 }, toFlood, color, canvas);
        floodFillNaive(imageData, { x: coordinate.x, y: coordinate.y - 1 }, toFlood, color, canvas);
    }
}

function floodFillStack(imageData, coordinate, toFlood, color, canvas) {
    var tumpukan = [];
    tumpukan.push({ x: coordinate.x, y: coordinate.y });

    while (tumpukan.length > 0) {
        var titik = tumpukan.pop();
        var index = getIndex(titik, canvas);

        var r = imageData.data[index];
        var g = imageData.data[index + 1];
        var b = imageData.data[index + 2];

        if (r == toFlood.r && g == toFlood.g && b == toFlood.b) {
            imageData.data[index] = color.r;
            imageData.data[index + 1] = color.g;
            imageData.data[index + 2] = color.b;
            imageData.data[index + 3] = color.a;

            tumpukan.push({ x: titik.x + 1, y: titik.y });
            tumpukan.push({ x: titik.x - 1, y: titik.y });
            tumpukan.push({ x: titik.x, y: titik.y + 1 });
            tumpukan.push({ x: titik.x, y: titik.y - 1 });

        }
    }
}

function floodFillStack2(imageData, coordinate, color, canvas) {
    var tumpukan = [];
    tumpukan.push({ x: coordinate.x, y: coordinate.y });

    var targetIndex = getIndex({ x: coordinate.x, y: coordinate.y }, canvas);
    var targetColor = { r: imageData.data[targetIndex], g: imageData.data[targetIndex + 1], b: imageData.data[targetIndex + 2] };

    if (targetColor.r != color.r || targetColor.g != color.g || targetColor.b != color.b) {
        while (tumpukan.length > 0) {
            var titik = tumpukan.pop();
            var index = getIndex(titik, canvas);

            var r = imageData.data[index];
            var g = imageData.data[index + 1];
            var b = imageData.data[index + 2]

            if (r == targetColor.r && g == targetColor.g && b == targetColor.b) {
                imageData.data[index] = color.r;
                imageData.data[index + 1] = color.g;
                imageData.data[index + 2] = color.b;
                imageData.data[index + 3] = color.a;

                tumpukan.push({ x: titik.x + 1, y: titik.y });
                tumpukan.push({ x: titik.x - 1, y: titik.y });
                tumpukan.push({ x: titik.x, y: titik.y + 1 });
                tumpukan.push({ x: titik.x, y: titik.y - 1 });
            }
        }
    }
}

function translation(coordinate1, coordinate2) {
    return { x: coordinate1.x + coordinate2.x, y: coordinate1.y + coordinate2.y };
}

function scale(coordinate1, coordinate2) {
    return { x: coordinate1.x * coordinate2.x, y: coordinate1.y * coordinate2.y };
}

function scaleCircle(radius, scale) {
    return radius * scale;
}

function rotation(coordinate, angle) {
    var x = coordinate.x * Math.cos(angle) - coordinate.y * Math.sin(angle);
    var y = coordinate.x * Math.sin(angle) + coordinate.y * Math.cos(angle);
    return { x: Math.round(x), y: Math.round(y) };
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function rotationFixed(coordinate, coordinateRotate, angle) {
    var p1 = translation(coordinate, { x: -coordinateRotate.x, y: -coordinateRotate.y })
    var p2 = rotation(p1, angle);
    var p3 = translation(p2, coordinateRotate);
    return p3;
}

function scaleFixed(coordinate, coordinateCenter, s) {
    var p1 = translation(coordinate, { x: -coordinateCenter.x, y: -coordinateCenter.y })
    var p2 = scale(p1, s);
    var p3 = translation(p2, coordinateCenter);
    return p3;
}

function translationArray(arrayCoordinate, coordinateTranslation) {
    var result = [];
    for (var x = 0; x < arrayCoordinate.length; x++) {
        var temp = translation(arrayCoordinate[x], coordinateTranslation);
        result.push(temp);
    }
    return result;
}

function rotationArray(arrayCoordinate, coordinateRotate, angle) {
    var result = [];
    for (var x = 0; x < arrayCoordinate.length; x++) {
        var temp = rotationFixed(arrayCoordinate[x], coordinateRotate, angle);
        result.push(temp);
    }
    return result;
}


function scaleArray(arrayCoordinate, coordinateCenter, scale) {
    var result = [];
    for (var x = 0; x < arrayCoordinate.length; x++) {
        var temp = scaleFixed(arrayCoordinate[x], coordinateCenter, scale);
        result.push(temp);
    }
    return result;
}

