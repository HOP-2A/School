import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PropsType = {
  classname: string;
  studentNum: number;
  submission: number;
  route: () => void;
};

export default function ClassesPage({
  classname,
  studentNum,
  submission,
  route,
}: PropsType) {
  return (
    <div
      className="gap-8"
      onClick={() => {
        route();
      }}
    >
      <Card className="rounded-3xl shadow-xl border border-gray-100 hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-md">
        <CardHeader className="pb-0">
          <Badge
            variant="secondary"
            className="px-5 py-1 text-lg font-semibold bg-gradient-to-r bg-blue-400 text-white shadow-md"
          >
            {classname}
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div className="text-gray-800 text-lg font-medium">
            {studentNum} Students
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative w-36 h-36">
              <div className="absolute inset-0 rounded-full border-8 border-gray-200 shadow-inner"></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-sky-500"
                style={{ clipPath: `inset(0 0 ${100 - submission}% 0)` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {submission}%
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Yesterdays Submission Rate</p>
          </div>

          <div className="p-4 rounded-2xl border bg-white/60 backdrop-blur-md shadow-sm flex flex-col gap-1 hover:bg-white/80 transition">
            <div className="text-gray-900 font-semibold">14 Assignments</div>
            <div className="text-gray-500 text-sm">waiting to be checked</div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-2xl border bg-white/60 backdrop-blur-md shadow-sm hover:bg-white/80 transition">
              <p className="text-gray-500 text-sm">Recent Activity</p>
              <h3 className="text-gray-900 font-medium">
                6 students submitted late
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
