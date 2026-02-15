import { NextRequest, NextResponse } from "next/server";
import { getJobRepository } from "@/server/repositories/jobRepoInstance";
import { listJobs } from "@/server/use-cases/jobs/listJobs";
import { createJob } from "@/server/use-cases/jobs/createJob";
import { ZodError } from "zod";


export async function GET(): Promise<Response> {
  const repo = getJobRepository();
  const jobs = await listJobs(repo);
  return NextResponse.json({ jobs });
}


export async function POST(request: NextRequest): Promise<Response>{
try{
  const repo = getJobRepository();
  const input:unknown = await request.json();
  const createdJob = await createJob(repo,input);
  return NextResponse.json({job: createdJob,meta: { source: "in-memory" }}, {status: 201});
} catch(err: unknown){
  if(err instanceof ZodError){
    return NextResponse.json(
      {
      error: {
      code: "VALIDATION_ERROR",
      message: "Invalid request body",
      details: err.flatten(),
      },
    },
  {status:400}
  );
  }
  return NextResponse.json(
    {
      error:{
        code:"INTERNAL_ERROR",
        message: "Something went wrong",
        details: {}
      },
    },
    {status: 500}
  );
}  
}