import { singleton } from "tsyringe";
import { Process } from "@/entities/Process";
import { supabase } from "./supabase";

@singleton()
export class ProcessRepository {

  async getById(id: number): Promise<Process | null> {
    const { data, error } = await supabase
      .from("process")
      .select("*")
      .eq("id", id)
      .single<Process>();

    if (error) throw error;
    return data;
  }

  async getByUte(ute: string): Promise<Process[]> {
    const { data, error } = await supabase
      .from("process")
      .select<string, Process>("*")
      .eq("ute", ute);

    if (error) throw error;
    console.log(data)
    return data ?? [];
  }

  async getAll(): Promise<Process[]> {
    const { data, error } = await supabase
      .from("process")
      .select<string, Process>("*");

    if (error) throw error;
    return data ?? [];
  }

}
