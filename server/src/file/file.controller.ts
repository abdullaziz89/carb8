import { Controller, Get, HttpStatus, Param, Response } from "@nestjs/common";
import { Response as Res } from "express";
import { FileService } from "./file.service";

@Controller("file")
export class FileController {

  constructor(
    private readonly fileService: FileService
  ) {
  }
}
