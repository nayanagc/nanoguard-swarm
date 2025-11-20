import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
}

const initialAlerts: Alert[] = [
  {
    id: "A-001",
    type: "critical",
    message: "Large debris D-003 on collision course with ISS",
    timestamp: "12:34:15",
  },
  {
    id: "A-002",
    type: "warning",
    message: "NS-002 initiated autonomous coordination protocol",
    timestamp: "12:32:08",
  },
  {
    id: "A-003",
    type: "info",
    message: "Debris D-001 successfully nudged into decay orbit",
    timestamp: "12:28:42",
  },
  {
    id: "A-004",
    type: "info",
    message: "AI classification confidence improved to 98.7%",
    timestamp: "12:25:19",
  },
];

const AlertFeed = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filterType, setFilterType] = useState<string>("all");

  const filteredAlerts = filterType === "all" 
    ? alerts 
    : alerts.filter(alert => alert.type === filterType);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-xs">
            CRITICAL
          </Badge>
        );
      case "warning":
        return (
          <Badge className="text-xs bg-warning text-warning-foreground">
            WARNING
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs text-success">
            INFO
          </Badge>
        );
    }
  };

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-muted-foreground">
          ALERT FEED
        </h3>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          {alerts.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllAlerts}
              className="h-8 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No alerts to display
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 bg-secondary/50 rounded-lg border border-border/50 hover:bg-secondary transition-colors group"
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getAlertBadge(alert.type)}
                    <span className="text-xs font-mono text-muted-foreground">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{alert.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(alert.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default AlertFeed;
