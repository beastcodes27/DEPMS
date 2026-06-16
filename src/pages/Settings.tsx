import { useState } from 'react';
import { PageHeader } from '@/components/crud/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { settingsService } from '@/services/dataService';
import { toast } from 'sonner';
import {
  Palette,
  Bell,
  GraduationCap,
  Shield,
  Database,
  Save,
} from 'lucide-react';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(settingsService.getSettings());

  const handleSaveSettings = () => {
    settingsService.updateSettings(settings);
    toast.success('Settings saved successfully');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setSettings({ ...settings, theme: newTheme });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Settings"
        description="Configure system settings and preferences"
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-4 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg">General</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
          <TabsTrigger value="academic" className="rounded-lg">Academic</TabsTrigger>
          <TabsTrigger value="system" className="rounded-lg">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-20 bg-white rounded-lg shadow-sm mb-3 border" />
                    <p className="font-medium">Light</p>
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-20 bg-slate-900 rounded-lg shadow-sm mb-3 border border-slate-700" />
                    <p className="font-medium">Dark</p>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="en" className="rounded-lg">English</SelectItem>
                      <SelectItem value="es" className="rounded-lg">Spanish</SelectItem>
                      <SelectItem value="fr" className="rounded-lg">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="America/New_York" className="rounded-lg">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago" className="rounded-lg">Central Time</SelectItem>
                      <SelectItem value="America/Denver" className="rounded-lg">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles" className="rounded-lg">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="MM/DD/YYYY" className="rounded-lg">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY" className="rounded-lg">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD" className="rounded-lg">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={settings.timeFormat}
                    onValueChange={(value: any) => setSettings({ ...settings, timeFormat: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="12h" className="rounded-lg">12-hour</SelectItem>
                      <SelectItem value="24h" className="rounded-lg">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, sms: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4 mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Academic Settings
              </CardTitle>
              <CardDescription>Configure academic year and grading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="academicYear">Current Academic Year</Label>
                <Input
                  id="academicYear"
                  value={settings.academicYear}
                  onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                  placeholder="e.g., 2024-2025"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Grading Scale</Label>
                <div className="border border-border/50 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 text-xs font-medium uppercase tracking-wider">
                    <div>Grade</div>
                    <div>Min %</div>
                    <div>Max %</div>
                    <div>Description</div>
                  </div>
                  <div className="divide-y divide-border/50">
                    {settings.gradingScale.map((grade) => (
                      <div key={grade.grade} className="grid grid-cols-4 gap-2 p-3 items-center">
                        <div className="font-semibold">{grade.grade}</div>
                        <div>{grade.minPercentage}%</div>
                        <div>{grade.maxPercentage}%</div>
                        <div className="text-sm text-muted-foreground">{grade.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                System Settings
              </CardTitle>
              <CardDescription>Manage system-wide configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium">User Registration</p>
                  <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium">Audit Logging</p>
                  <p className="text-sm text-muted-foreground">Log all system activities</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible system actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                <div>
                  <p className="font-medium text-destructive">Reset System Data</p>
                  <p className="text-sm text-muted-foreground">Clear all data and reset to defaults</p>
                </div>
                <Button variant="destructive" className="rounded-xl">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="rounded-xl">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
