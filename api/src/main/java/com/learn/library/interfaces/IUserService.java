package com.learn.library.interfaces;
import java.util.List;

import com.learn.library.model.User;

public interface IUserService{
	public User login(String username, String password);
	public User create(User user);
	public User update(User user);
	public void delete(User user);
	public User findById(Long id);
	public List<User> findAll();
	public String generateUsername(String fullname, String identification);
}
