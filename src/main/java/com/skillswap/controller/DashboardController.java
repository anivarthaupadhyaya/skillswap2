package com.skillswap.controller;

import com.skillswap.entity.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {

    @GetMapping
    public String dashboard(HttpSession session, Model model) {
        Object sessionUser = session.getAttribute("user");
        if (sessionUser instanceof User user) {
            model.addAttribute("username", user.getEmail());
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
