package com.learn.library.seeders;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;

import com.learn.library.model.User;
import com.learn.library.model.UserIdentificationType;
import com.learn.library.services.UserService;

@Configuration
public class UserSeeder implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(UserSeeder.class);

    @Autowired
    private UserService userService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Running user seeder...");

        if (userService.count() == 0) {
            User user = new User("0", UserIdentificationType.NAN, "admin", "admin", "admin", "admin", -1, "");
            userService.create(user);

            User bibliotecaria = new User("1", UserIdentificationType.NAN, "bibliotecaria", "bibliotecaria", 
                                           "bibliotecaria", "bibliotecaria", -1, "");
            userService.create(bibliotecaria);

            log.info("Users seeded successfully.");
        } else {
            log.info("User seeder skipped: users already exist.");
        }
    }
}
