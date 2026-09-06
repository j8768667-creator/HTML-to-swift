import { PresetTemplate } from "../types";

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "login-card",
    name: "Login & Auth Form",
    category: "Forms",
    description: "Glassmorphism card with email, secure password, remember me toggle, and sign-in button.",
    iconName: "lock",
    html: `<div class="p-6 bg-white rounded-2xl shadow-lg max-w-md w-full" style="background-color: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
  <div class="flex flex-col gap-2" style="margin-bottom: 20px;">
    <h2 class="text-2xl font-bold" style="color: #111827; font-weight: 700;">Welcome Back</h2>
    <p class="text-sm" style="color: #6B7280;">Please sign in to continue to your Apple account.</p>
  </div>

  <form class="flex flex-col gap-4" style="display: flex; flex-direction: column; gap: 16px;">
    <div class="flex flex-col gap-1">
      <label class="text-sm font-semibold" style="color: #374151;">Email Address</label>
      <input type="email" name="userEmail" placeholder="alex.appleseed@icloud.com" class="p-3 border rounded-lg" style="padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px;" />
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-sm font-semibold" style="color: #374151;">Password</label>
      <input type="password" name="userPassword" placeholder="••••••••" class="p-3 border rounded-lg" style="padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px;" />
    </div>

    <div class="flex flex-row items-center gap-2" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
      <label class="flex flex-row items-center gap-2 text-sm" style="display: flex; align-items: center; gap: 8px; color: #4B5563;">
        <input type="checkbox" name="rememberMe" checked />
        <span>Remember me</span>
      </label>
      <a href="https://apple.com/recover" class="text-sm" style="color: #0071E3;">Forgot?</a>
    </div>

    <button type="submit" class="p-3 rounded-lg text-white font-bold" style="background-color: #0071E3; color: #ffffff; padding: 14px; border-radius: 10px; font-weight: 600;" data-sf-symbol="arrow.right">
      Sign In
    </button>
  </form>
</div>`,
  },
  {
    id: "profile-card",
    name: "iOS Profile Card",
    category: "Social",
    description: "User profile with avatar, verified badge, stats banner, and follow action.",
    iconName: "user",
    html: `<div class="p-6 bg-white rounded-2xl shadow-md" style="background-color: #ffffff; border-radius: 20px; padding: 24px;">
  <div class="flex flex-row items-center gap-4" style="display: flex; flex-direction: row; align-items: center; gap: 16px; margin-bottom: 16px;">
    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" alt="Sarah Connor" width="70" height="70" style="border-radius: 35px;" />
    <div class="flex flex-col gap-1">
      <div class="flex flex-row items-center gap-2" style="display: flex; flex-direction: row; align-items: center; gap: 6px;">
        <h3 class="text-xl font-bold" style="color: #1F2937;">Sarah Connor</h3>
        <i class="fa fa-check" data-sf-symbol="checkmark.seal.fill" style="color: #0071E3;"></i>
      </div>
      <p class="text-sm" style="color: #6B7280;">iOS & Swift Playgrounds Developer</p>
      <span class="text-xs" style="color: #9CA3AF;">Cupertino, California</span>
    </div>
  </div>

  <div class="flex flex-row justify-between p-3 rounded-xl" style="display: flex; flex-direction: row; justify-content: space-around; background-color: #F3F4F6; padding: 12px; border-radius: 12px; margin-bottom: 16px;">
    <div class="flex flex-col items-center">
      <strong class="text-lg font-bold" style="color: #111827;">142</strong>
      <span class="text-xs" style="color: #6B7280;">Projects</span>
    </div>
    <div class="flex flex-col items-center">
      <strong class="text-lg font-bold" style="color: #111827;">28.4K</strong>
      <span class="text-xs" style="color: #6B7280;">Followers</span>
    </div>
    <div class="flex flex-col items-center">
      <strong class="text-lg font-bold" style="color: #111827;">340</strong>
      <span class="text-xs" style="color: #6B7280;">Following</span>
    </div>
  </div>

  <div class="flex flex-row gap-3" style="display: flex; flex-direction: row; gap: 12px;">
    <button class="p-3 text-white font-semibold rounded-xl" style="background-color: #0071E3; color: white; padding: 12px 24px; border-radius: 10px; font-weight: 600;" data-sf-symbol="person.badge.plus">
      Follow
    </button>
    <button class="p-3 rounded-xl font-semibold" style="background-color: #E5E7EB; color: #374151; padding: 12px 20px; border-radius: 10px;" data-sf-symbol="message.fill">
      Message
    </button>
  </div>
</div>`,
  },
  {
    id: "product-card",
    name: "E-Commerce Product Card",
    category: "Commerce",
    description: "Product preview with badge, high-res image, pricing, and purchase button.",
    iconName: "shopping-bag",
    html: `<div class="p-4 bg-white rounded-2xl shadow-md max-w-sm" style="background-color: #ffffff; border-radius: 18px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
  <div class="flex flex-row justify-between items-center" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
    <span class="text-xs font-bold" style="background-color: #FEF3C7; color: #D97706; padding: 4px 8px; border-radius: 6px;">NEW RELEASE</span>
    <i class="fa fa-heart" data-sf-symbol="heart.fill" style="color: #EF4444;"></i>
  </div>

  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=350&fit=crop" alt="Wireless Studio Headphones" width="320" height="200" style="border-radius: 12px; margin-bottom: 12px;" />

  <h4 class="text-lg font-bold" style="color: #111827; margin-bottom: 4px;">Studio Pro Wireless</h4>
  <p class="text-sm" style="color: #6B7280; margin-bottom: 12px;">Active Noise Cancellation with Spatial Audio transparency mode.</p>

  <div class="flex flex-row items-center justify-between" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
    <div class="flex flex-col">
      <span class="text-xs" style="color: #9CA3AF;">Price</span>
      <strong class="text-xl font-bold" style="color: #10B981;">$349.00</strong>
    </div>
    <button class="p-3 text-white rounded-xl" style="background-color: #111827; color: white; padding: 10px 18px; border-radius: 10px;" data-sf-symbol="cart.fill">
      Add to Bag
    </button>
  </div>
</div>`,
  },
  {
    id: "settings-list",
    name: "Settings & Preferences",
    category: "System",
    description: "Grouped settings view with toggles, sliders, and navigation links.",
    iconName: "settings",
    html: `<div class="p-6 bg-white rounded-2xl shadow-sm" style="background-color: #ffffff; border-radius: 16px; padding: 20px;">
  <h3 class="text-xl font-bold" style="color: #111827; margin-bottom: 16px;">App Settings</h3>

  <div class="flex flex-col gap-4" style="display: flex; flex-direction: column; gap: 16px;">
    <div class="flex flex-row items-center justify-between" style="display: flex; justify-content: space-between; align-items: center;">
      <div class="flex flex-row items-center gap-3" style="display: flex; align-items: center; gap: 12px;">
        <i class="fa fa-bell" data-sf-symbol="bell.badge.fill" style="color: #EF4444;"></i>
        <div class="flex flex-col">
          <span class="font-semibold text-sm" style="color: #1F2937;">Push Notifications</span>
          <small style="color: #6B7280;">Get instant alerts on updates</small>
        </div>
      </div>
      <input type="checkbox" name="enableNotifications" checked />
    </div>

    <hr style="border-top: 1px solid #E5E7EB;" />

    <div class="flex flex-row items-center justify-between" style="display: flex; justify-content: space-between; align-items: center;">
      <div class="flex flex-row items-center gap-3" style="display: flex; align-items: center; gap: 12px;">
        <i class="fa fa-moon" data-sf-symbol="moon.fill" style="color: #8B5CF6;"></i>
        <div class="flex flex-col">
          <span class="font-semibold text-sm" style="color: #1F2937;">Dark Appearance</span>
          <small style="color: #6B7280;">Match system dark mode</small>
        </div>
      </div>
      <input type="checkbox" name="enableDarkMode" />
    </div>

    <hr style="border-top: 1px solid #E5E7EB;" />

    <div class="flex flex-col gap-2" style="display: flex; flex-direction: column; gap: 8px;">
      <div class="flex flex-row items-center justify-between" style="display: flex; justify-content: space-between;">
        <span class="font-semibold text-sm" style="color: #1F2937;">Haptic Feedback Volume</span>
        <span class="text-xs" style="color: #6B7280;">75%</span>
      </div>
      <input type="range" name="hapticIntensity" min="0" max="100" value="75" />
    </div>
  </div>
</div>`,
  },
  {
    id: "pricing-card",
    name: "SaaS Pricing Card",
    category: "Marketing",
    description: "Modern pricing tier with feature checklist and call-to-action button.",
    iconName: "tag",
    html: `<div class="p-6 bg-white rounded-2xl shadow-lg max-w-sm" style="background-color: #ffffff; border-radius: 20px; padding: 24px; border: 2px solid #0071E3;">
  <span class="text-xs font-bold" style="background-color: #E0F2FE; color: #0284C7; padding: 4px 10px; border-radius: 6px;">MOST POPULAR</span>

  <h3 class="text-2xl font-bold" style="color: #111827; margin-top: 8px; margin-bottom: 4px;">Developer Pro</h3>
  <p class="text-sm" style="color: #6B7280; margin-bottom: 16px;">Everything needed to build and ship Swift applications.</p>

  <div class="flex flex-row items-baseline gap-1" style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 20px;">
    <strong class="text-4xl font-bold" style="color: #111827;">$29</strong>
    <span class="text-sm" style="color: #6B7280;">/ month</span>
  </div>

  <ul style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
    <li>Unlimited Swift Playgrounds exports</li>
    <li>Full Swift 6 & iOS 18 component support</li>
    <li>Over 5,000 Apple SF Symbols mapped</li>
    <li>Priority code generation with Gemini AI</li>
  </ul>

  <button class="w-full p-3 text-white font-bold rounded-xl" style="background-color: #0071E3; color: white; width: 100%; padding: 14px; border-radius: 12px;" data-sf-symbol="sparkles">
    Get Started Now
  </button>
</div>`,
  },
  {
    id: "task-list",
    name: "Task & Checklist Board",
    category: "Productivity",
    description: "Interactive task list with priority badges and due dates.",
    iconName: "check-square",
    html: `<div class="p-6 bg-white rounded-2xl shadow-md" style="background-color: #ffffff; border-radius: 16px; padding: 20px;">
  <div class="flex flex-row items-center justify-between" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
    <div>
      <h3 class="text-xl font-bold" style="color: #111827;">Today's Sprint</h3>
      <span class="text-xs" style="color: #6B7280;">3 of 4 completed</span>
    </div>
    <button class="p-2 rounded-lg" style="background-color: #0071E3; color: white; padding: 8px 14px; border-radius: 8px;" data-sf-symbol="plus">
      New Task
    </button>
  </div>

  <div class="flex flex-col gap-3" style="display: flex; flex-direction: column; gap: 12px;">
    <div class="flex flex-row items-center gap-3 p-3 rounded-xl" style="display: flex; align-items: center; gap: 12px; background-color: #F9FAFB; padding: 12px; border-radius: 10px;">
      <input type="checkbox" name="task1" checked />
      <div class="flex flex-col">
        <span class="font-semibold text-sm" style="color: #1F2937;">Audit Swift 6 Concurrency</span>
        <small style="color: #9CA3AF;">Due today at 5:00 PM</small>
      </div>
    </div>

    <div class="flex flex-row items-center gap-3 p-3 rounded-xl" style="display: flex; align-items: center; gap: 12px; background-color: #F9FAFB; padding: 12px; border-radius: 10px;">
      <input type="checkbox" name="task2" checked />
      <div class="flex flex-col">
        <span class="font-semibold text-sm" style="color: #1F2937;">Export Swift Playgrounds Template</span>
        <small style="color: #9CA3AF;">Playgrounds 4 on iPadOS</small>
      </div>
    </div>

    <div class="flex flex-row items-center gap-3 p-3 rounded-xl" style="display: flex; align-items: center; gap: 12px; background-color: #F9FAFB; padding: 12px; border-radius: 10px;">
      <input type="checkbox" name="task3" />
      <div class="flex flex-col">
        <span class="font-semibold text-sm" style="color: #1F2937;">Connect Gemini AI Model Pipeline</span>
        <small style="color: #9CA3AF;">Pending API key review</small>
      </div>
    </div>
  </div>
</div>`,
  },
];
