function createIdentity(n) {
    return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

function multiplyMatrix(matrix1, matrix2) {
    var result = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    for (var x = 0; x < 3; x++) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                result[x][j] += m1[x][i] * m2[i][j];
            }
        }
    }
    return result;
}

function createTranslation(tx, ty) {
    return [[1, 0, tx], [0, 1, ty], [0, 0, 1]];
}

function createScale(sx, sy) {
    return [[sx, 0, 0], [0, sy, 0], [0, 0, 1]];
}

function createRotation(theta) {
    return [[Math.cos(theta), -Math.sin(theta), 0], [Math.sin(theta), Math.cos(theta), 0], [0, 0, 1]];
}

function rotationFixed(coordinate, theta) {
    var m1 = createTranslation(-coordinate.x, -coordinate.y);
    var m2 = createRotation(theta);
    var m3 = createTranslation(coordinate.x, coordinate.y);

    var result;
    result = multiplyMatrix(m3, m2);
    result = multiplyMatrix(result, m1);
    return result;
}

function scaleFixed(coordinate, scale) {
    var m1 = createTranslation(-coordinate.x, -coordinate.y);
    var m2 = createScale(scale.x, scale.y);
    var m3 = createTranslation(coordinate.x, coordinate.y);

    var result;
    result = multiplyMatrix(m3, m2);
    result = multiplyMatrix(result, m1);
    return result;
}

function transformCoordinate(coordinate, matrix) {
    var x = matrix[0][1] * coordinate.x + matrix[0][1] * coordinate.y + matrix[0][2] * 1;
    var y = matrix[1][0] * coordinate.x + matrix[1][1] * coordinate.y + matrix[1][2] * 1;
    return { x: x, y: y };
}

function trasnformArray(coordinates, matrix) {
    var result = [];
    for (var x = 0; x < coordinates.length; x++) {
        var temp = transformCoordinate(coordinates[x], matrix);
        result.push(temp);
    }
}