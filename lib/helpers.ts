import * as fs from "fs";

export function filesShouldNotExist(files: string[]) {
    for (let file of files) {
        if (fs.existsSync(file)) throw new Error(
            `File ${file} already exists. Remove it manually if you want to create a new file.`
        );
    }
}

export function filesShouldExist(files: string[]) {
    for (let file of files) {
        if (!fs.existsSync(file)) throw new Error(
            `File ${file} does not exist. Please ensure you call the command in charge of generating it before this one.`
        );
    }
}

export function mkdirp(dir: string) {
    fs.mkdirSync(dir, { recursive: true });
}

export function objectToFile(obj: any, file: string) {
    fs.writeFileSync(file, JSON.stringify(obj));
}

export function fileToObject(file: string) : any {
    const jsonData = fs.readFileSync(file, 'utf8');
    return JSON.parse(jsonData);
}

export function removeFile(path: string) {
    fs.unlinkSync(path);
}
