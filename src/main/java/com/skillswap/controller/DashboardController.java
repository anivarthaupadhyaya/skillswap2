package com.skillswap.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import java.security.Principal;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {

    @GetMapping
    public String dashboard(Principal principal, Model model) {
        if (principal != null) {
            model.addAttribute("username", principal.getName());
        }
        return "dashboard";
    }

    @GetMapping("/mentee")
    public String menteeDashboard(Model model) {
        return "dashboard/mentee-dashboard";
    }

    @GetMapping("/mentor")
    public String mentorDashboard(Model model) {
        return "dashboard/mentor-dashboard";
    }

    @GetMapping("/hod")
    public String hodDashboard(Model model) {
        return "dashboard/hod-dashboard";
    }

    @GetMapping("/admin")
    public String adminDashboard(Model model) {
        return "dashboard/admin-dashboard";
    }
}
