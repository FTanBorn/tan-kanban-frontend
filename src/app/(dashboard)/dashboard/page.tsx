"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Plus,
  Search,
  Crown,
  LayoutDashboard,
  ListTodo,
  ClipboardCheck,
  Loader2,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useBoardStore } from "@/store/board-store";
import { Board } from "@/lib/types/board";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateBoardModal } from "@/components/modals/create-board-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Board Card Component
function BoardCard({ board }: { board: Board }) {
  const { data: session } = useSession();
  const isOwner = board.owner?._id === session?.user?.id;

  return (
    <Link
      href={`/boards/${board._id}`}
      className={cn(
        "group block relative rounded-lg border bg-card hover:shadow-lg transition-all duration-200",
        "hover:border-primary/50",
        isOwner && "bg-yellow-500/5 hover:border-yellow-500/50"
      )}
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium truncate">{board.name}</h3>
          {isOwner && (
            <Badge
              variant="secondary"
              className="bg-yellow-500/10 text-yellow-600"
            >
              Owner
            </Badge>
          )}
        </div>

        {/* Description */}
        {board.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {board.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Members */}
          <div className="flex -space-x-2">
            <Avatar className="h-7 w-7 border-2 border-background">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {board.owner?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {board.members && board.members.length > 0 && (
              <div className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">
                  +{board.members.length}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground">
            {isOwner ? "You own this board" : `Created by ${board.owner?.name}`}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Create Board Card Component
function CreateBoardCard() {
  return (
    <CreateBoardModal>
      <button className="relative group h-[180px] rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground group-hover:text-primary">
          <div className="rounded-full bg-muted p-3 group-hover:bg-primary/10 transition-colors duration-200">
            <Plus className="h-6 w-6" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium">Create New Board</span>
            <span className="text-xs text-muted-foreground">
              Add a new workspace for your team
            </span>
          </div>
        </div>
      </button>
    </CreateBoardModal>
  );
}

// Stats Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: any;
  description: string;
  isDisabled?: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  isDisabled,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        isDisabled && "opacity-60"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { boards, loading } = useBoardStore();
  const { data: session } = useSession();

  // Filter boards
  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group boards
  const ownedBoards = filteredBoards.filter(
    (board) => board.owner?._id === session?.user?.id
  );
  const sharedBoards = filteredBoards.filter(
    (board) => board.owner?._id !== session?.user?.id
  );

  // Stats data
  const stats = [
    {
      title: "Total Boards",
      value: boards.length,
      icon: LayoutDashboard,
      description: "Active boards you have access to",
    },
    {
      title: "My Boards",
      value: ownedBoards.length,
      icon: Crown,
      description: "Boards you've created",
    },
    {
      title: "Shared Boards",
      value: sharedBoards.length,
      icon: Users,
      description: "Boards shared with you",
    },
    {
      title: "Total Tasks",
      value: "Coming Soon",
      icon: ListTodo,
      description: "Tasks across all boards",
      isDisabled: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center gap-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search boards..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CreateBoardModal>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Board
                </Button>
              </CreateBoardModal>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="h-[40vh] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-background"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="my-boards"
                  className="data-[state=active]:bg-background"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  My Boards ({ownedBoards.length})
                </TabsTrigger>
                <TabsTrigger
                  value="shared"
                  className="data-[state=active]:bg-background"
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Shared ({sharedBoards.length})
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                  ))}
                </div>

                {/* Recent Boards */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Boards</CardTitle>
                        <CardDescription>
                          Your recently updated boards
                        </CardDescription>
                      </div>
                      <CreateBoardModal>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New
                        </Button>
                      </CreateBoardModal>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredBoards.slice(0, 6).map((board) => (
                        <BoardCard key={board._id} board={board} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* My Boards Tab */}
              <TabsContent value="my-boards">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <CreateBoardCard />
                  {ownedBoards.map((board) => (
                    <BoardCard key={board._id} board={board} />
                  ))}
                </div>
              </TabsContent>

              {/* Shared Boards Tab */}
              <TabsContent value="shared">
                {sharedBoards.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 font-semibold">No Shared Boards</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You don't have any boards shared with you yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sharedBoards.map((board) => (
                      <BoardCard key={board._id} board={board} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
