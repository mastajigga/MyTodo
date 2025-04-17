$migrations = @(
    @{
        OldName = "20240000000001_common_functions.sql"
        NewName = "20240000000001_common_functions.sql"
    },
    @{
        OldName = "20240000000002_profiles.sql"
        NewName = "20240000000002_profiles.sql"
    },
    @{
        OldName = "20240000000003_workspaces.sql"
        NewName = "20240000000003_workspaces.sql"
    },
    @{
        OldName = "20240000000004_workspace_policies.sql"
        NewName = "20240000000004_workspace_policies.sql"
    },
    @{
        OldName = "20240000000005_projects.sql"
        NewName = "20240000000005_projects.sql"
    },
    @{
        OldName = "20240000000006_task_lists.sql"
        NewName = "20240000000006_task_lists.sql"
    },
    @{
        OldName = "20240000000007_project_activities.sql"
        NewName = "20240000000007_project_activities.sql"
    },
    @{
        OldName = "20240000000008_tasks.sql"
        NewName = "20240000000008_tasks.sql"
    },
    @{
        OldName = "20240000000009_project_members.sql"
        NewName = "20240000000009_project_members.sql"
    },
    @{
        OldName = "20240000000010_task_activities.sql"
        NewName = "20240000000010_task_activities.sql"
    },
    @{
        OldName = "20240000000011_tags.sql"
        NewName = "20240000000011_tags.sql"
    },
    @{
        OldName = "20240000000012_project_policies.sql"
        NewName = "20240000000012_project_policies.sql"
    },
    @{
        OldName = "20240317000000_create_user_settings.sql"
        NewName = "20240317000000_create_user_settings.sql"
    }
)

$migrationsPath = "supabase/migrations"

foreach ($migration in $migrations) {
    $oldPath = Join-Path $migrationsPath $migration.OldName
    $newPath = Join-Path $migrationsPath $migration.NewName
    
    if (Test-Path $oldPath) {
        if ($oldPath -ne $newPath) {
            Move-Item -Path $oldPath -Destination $newPath -Force
            Write-Host "Renamed $($migration.OldName) to $($migration.NewName)"
        }
        else {
            Write-Host "Skipped $($migration.OldName) (already correct)"
        }
    }
    else {
        Write-Host "Warning: Could not find $($migration.OldName)"
    }
} 