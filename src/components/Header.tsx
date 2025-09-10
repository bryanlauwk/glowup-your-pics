import { UserMenu } from "@/components/UserMenu";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-gradient-primary">
            SwipeBoost
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};