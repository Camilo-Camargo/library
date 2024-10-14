package com.learn.library.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.learn.library.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRes implements Serializable {
    private Long id;
    private String username;
    private String identification;
    private String fullname;
    private String role;
    private int age;
    private String profileImage;

    public static UserRes fromEntity(User user) {
        return new UserRes(user.getId(), user.getUsername(), user.getIdentification(), user.getFullname(),
                user.getRole(),user.getAge(),user.getProfileImage());
    }

    public static List<UserRes> fromEntities(List<User> users) {
        List<UserRes> usersRes = new ArrayList<>();
        for (User user : users) {
            usersRes.add(fromEntity(user));
        }
        return usersRes;
    }
}
