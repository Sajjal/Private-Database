const fs = require("fs").promises;
const { encrypt, decrypt } = require("./encrypt");

/**************  Read File *********************/
async function readFile(fileName) {
  try {
    return await fs.readFile(fileName, "binary");
  } catch {
    return;
  }
}

/**************  Add Data *********************/
async function saveData(data) {
  const q = await encrypt(data.question);
  const a = await encrypt(data.answer);
  const id = data.id;
  const newData = { q, a, id };
  let fileData;
  let indexFile;

  // Check if there is an index file
  try {
    indexFile = await readFile(`./data/index.json`);
  } catch {
    console.log("Creating New Index File");
  }

  // If no index file is found then create one.
  if (!indexFile || indexFile.length < 5) {
    indexFile = "[]";
    indexFile = JSON.parse(indexFile);
    indexData = indexFile.push({ index: 1, value: { start: data.id, end: "" } });
    await fs.writeFile(`./data/index.json`, JSON.stringify(indexFile, null, 2), "utf-8");
    fileName = `data${indexFile.length}`;
  } else {
    indexFile = JSON.parse(indexFile);
    fileName = `data${indexFile.length}`;
  }

  // Check if the data file is there.
  try {
    fileData = await readFile(`./data/${fileName}.json`);
  } catch {
    console.log("Creating New File");
  }

  // If there is no data-file
  if (!fileData || fileData.length <= 1) fileData = "[]";
  fileData = JSON.parse(fileData);

  // If the data-file has more than 10 records, create a new data-file and update the index.
  if (fileData.length >= 10) {
    indexFile[indexFile.length - 1].value.end = data.id - 1;
    indexFile.push({ index: indexFile.length + 1, value: { start: data.id, end: "" } });
    await fs.writeFile(`./data/index.json`, JSON.stringify(indexFile, null, 2), "utf-8");
    fileName = `data${indexFile.length}`;
    fileData = "[]";
    fileData = JSON.parse(fileData);
  }

  fileData.push(newData);
  await fs.writeFile(`./data/${fileName}.json`, JSON.stringify(fileData, null, 2), "utf-8");
}

/**************  Retrieve Data *********************/
async function getData(fileName) {
  let data;
  try {
    data = await readFile(`./data/${fileName}.json`);
  } catch {
    console.log("Unable to read file");
  }

  if (!data || data.length <= 10) return;
  data = JSON.parse(data);
  const decryptedData = [];
  for (let i = 0; i < data.length; i++) {
    const question = await decrypt(data[i].q);
    const answer = await decrypt(data[i].a);
    const id = data[i].id;
    decryptedData.push({ question, answer, id });
  }
  return decryptedData;
}

/**************  Update Data *********************/
async function updateData(fileName, data) {
  const id = data.id;

  let fileData;
  try {
    fileData = await readFile(`./data/${fileName}.json`);
  } catch {
    console.log("File not found!");
  }
  if (!fileData || fileData.length <= 1) return;

  fileData = JSON.parse(fileData);

  for (let i = 0; i < fileData.length; i++) {
    if (fileData[i].id === id) {
      const q = await encrypt(data.question);
      const a = await encrypt(data.answer);
      fileData[i].q = q;
      fileData[i].a = a;
      return await fs.writeFile(`./data/${fileName}.json`, JSON.stringify(fileData, null, 2), "utf-8");
    }
  }
  return;
}

/**************  Delete Data *********************/
async function removeData(fileName, recordID) {
  let fileData;
  try {
    fileData = await readFile(`./data/${fileName}.json`);
  } catch {
    console.log("File not found!");
  }

  if (!fileData || fileData.length <= 1) return;

  // If there is only one record in a data-file, remove the entire data-file and update Index
  fileData = JSON.parse(fileData);
  if (fileData.length == 1) {
    let data = await readFile("./data/index.json");
    if (!data) return;
    data = JSON.parse(data);

    // Update the index file
    const indexData = [];
    if (data.length > 1) {
      for (let i = 0; i < data.length; i++) {
        if (recordID >= data[i].value.start && recordID <= data[i].value.end) {
          continue;
        } else if (data[i].value.end != "") indexData.push(data[i]);
      }
    }
    await fs.writeFile(`./data/index.json`, JSON.stringify(indexData, null, 2), "utf-8");

    // Remove the Data-File
    fs.unlink(`./data/${fileName}.json`, (err) => {
      if (err) {
        return;
      }
    });
    return;
  }

  // If there is more than one record in a data-file, only delete the record
  newData = fileData.filter((data) => {
    return data.id != recordID;
  });
  return await fs.writeFile(`./data/${fileName}.json`, JSON.stringify(newData, null, 2), "utf-8");
}

/**************  Get File Name *********************/
async function getFileName(id) {
  let data = await readFile("./data/index.json");
  if (!data) return;
  data = JSON.parse(data);
  if (data.length == 1) return "data1";
  for (let i = 0; i < data.length; i++) {
    if (data[i].value.end) {
      if (id >= data[i].value.start && id <= data[i].value.end) return `data${data[i].index}`;
    } else return `data${data[i].index}`;
  }
}

/**************  Get Single Record *********************/
async function getSingleRecord(id) {
  const fileName = await getFileName(id);
  let data;
  if (fileName) data = await getData(fileName);
  for (let i = 0; i < data.length; i++) {
    if (id == data[i].id) return { data: data[i], fileName };
  }
  return;
}

module.exports = { readFile, saveData, getData, updateData, removeData, getFileName, getSingleRecord };
